const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const crypto = require("crypto");
require("dotenv").config();

const app = express();

const PORT = 8080;
const ALLOW_START_WITHOUT_DB = process.env.ALLOW_START_WITHOUT_DB === "true";
const AUTH_SECRET = process.env.AUTH_SECRET || "dev-simple-blog-auth-secret";
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

const USERS = [
  {
    username: "admin",
    password: "123",
    name: "Administrator",
    role: "admin",
  },
  {
    username: "user1",
    password: "123",
    name: "User 1",
    role: "user",
  },
];

function authenticateUser(username, password, allowedRoles = []) {
  return USERS.find((user) => {
    const matchedCredentials =
      user.username === username && user.password === password;
    const matchedRole =
      allowedRoles.length === 0 || allowedRoles.includes(user.role);

    return matchedCredentials && matchedRole;
  });
}

function toLoginPayload(user) {
  return {
    username: user.username,
    name: user.name,
    role: user.role,
  };
}

function toBase64Url(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function signPayload(payload) {
  return crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(payload)
    .digest("base64url");
}

function createToken(user) {
  const header = toBase64Url({ alg: "HS256", typ: "JWT" });
  const payload = toBase64Url({
    username: user.username,
    name: user.name,
    role: user.role,
    exp: Date.now() + TOKEN_TTL_MS,
  });
  const signature = signPayload(`${header}.${payload}`);

  return `${header}.${payload}.${signature}`;
}

function verifyToken(token) {
  const parts = String(token || "").split(".");

  if (parts.length !== 3) {
    return null;
  }

  const [header, payload, signature] = parts;
  const expectedSignature = signPayload(`${header}.${payload}`);
  const signatureBuffer = Buffer.from(signature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedSignatureBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
  ) {
    return null;
  }

  try {
    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );

    if (!decoded.exp || decoded.exp < Date.now()) {
      return null;
    }

    return {
      username: decoded.username,
      name: decoded.name,
      role: decoded.role,
    };
  } catch {
    return null;
  }
}

function requireAuth(allowedRoles = []) {
  return (req, res, next) => {
    const authHeader = req.get("authorization") || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Missing authentication token" });
    }

    const user = verifyToken(token);

    if (!user) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = user;
    return next();
  };
}

app.use(cors());
app.use(express.json());

function requireDatabase(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "Database is not connected. Please try again later.",
    });
  }

  return next();
}

function toSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      default: "Anonymous",
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);
//post
const postSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    excerpt: {
      type: String,
      default: "",
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      default: "Admin",
      trim: true,
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

const Post = mongoose.model("Post", postSchema, "post");

//user
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      min: 0,
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);
const User = mongoose.model("User", userSchema, "user");
//menu
const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);
const Menu = mongoose.model("Menu", menuSchema, "menu");

//noti
const notiSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  noidung: {
    type: String,
    required: true,
    trim: true,
  },
});
const Noti = mongoose.model("Noti", notiSchema, "notification");

const predictSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  input: {
    type: String,
    required: true,
    trim: true,
  },
  output: {
    type: String,
    required: true,
    trim: true,
  },
});
const Predict = mongoose.model("Predict", predictSchema, "predict");

const registerSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: false,
  },
  cv: {
    type: String,
    required: true,
  },
});
const Register = mongoose.model("Register", registerSchema, "register");

async function buildUniqueSlug(baseSlug) {
  const fallbackSlug = `post-${Date.now()}`;
  const safeBaseSlug = baseSlug || fallbackSlug;
  let candidateSlug = safeBaseSlug;
  let suffix = 2;

  while (await Post.exists({ slug: candidateSlug })) {
    candidateSlug = `${safeBaseSlug}-${suffix}`;
    suffix += 1;
  }

  return candidateSlug;
}

async function buildUniqueSlugForUpdate(baseSlug, excludedId) {
  const fallbackSlug = `post-${Date.now()}`;
  const safeBaseSlug = baseSlug || fallbackSlug;
  let candidateSlug = safeBaseSlug;
  let suffix = 2;

  while (await Post.exists({ slug: candidateSlug, _id: { $ne: excludedId } })) {
    candidateSlug = `${safeBaseSlug}-${suffix}`;
    suffix += 1;
  }

  return candidateSlug;
}

app.get("/api/menu", requireDatabase, async function (req, res) {
  const menus = await Menu.find().sort({ price: -1 });
  res.status(200).json(menus.map(toMenuSummary));
});

app.get("/api/menu/:name", requireDatabase, async function (req, res) {
  const name = decodeURIComponent(req.params.name || "").trim();
  const menu = await Menu.findOne({ name });

  if (!menu) {
    return res.status(404).json({ message: "Menu not found" });
  }

  return res.status(200).json(toMenuSummary(menu));
});
app.get("/api/register", requireDatabase, async function (req, res) {
  const registers = await Register.find().sort({ age: -1 });
  res.status(200).json(registers.map(toRegisterSummary));
});
app.get("/api/predict/:id", requireDatabase, async function (req, res) {
  const id = req.params.id;
  const predict = await Predict.findOne({ id });
  if (!predict) {
    return res.status(404).json({ message: "Predict not found" });
  }
  return res.status(200).json(toPredictSummary(predict));
});

function toMenuSummary(menu) {
  return {
    name: menu.name,
    price: menu.price,
  };
}

function toNotiSummary(noti) {
  return {
    id: noti.id,
    name: noti.name,
    noidung: noti.noidung,
  };
}

function toPostSummary(post) {
  return {
    id: post._id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    author: post.author,
    createdAt: post.createdAt,
  };
}

function toPredictSummary(predict) {
  return {
    id: predict.id,
    name: predict.name,
    input: predict.input,
    output: predict.output,
  };
}

const toRegisterSummary = (register) => {
  return {
    id: register.id,
    name: register.name,
    age: register.age,
    cv: register.cv,
  };
};

app.get("/api/posts", requireDatabase, async function (req, res) {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.status(200).json(posts.map(toPostSummary));
});

app.get("/api/user", requireDatabase, async function (req, res) {
  try {
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user",
      error: error.message,
    });
  }
});

app.get("/api/notification", requireDatabase, async function (req, res) {
  try {
    const noti = await Noti.find();
    res.status(200).json(noti);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch noti",
      error: error.message,
    });
  }
});
app.get("/api/predict", requireDatabase, async function (req, res) {
  const predict = await Predict.find();
  res.status(201).json(predict.map(toPredictSummary));
});
app.get("/api/post/:slug", requireDatabase, async function (req, res) {
  const slug = req.params.slug;
  const post = await Post.findOne({ slug });

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  return res.status(200).json(post);
});

app.post(
  "/api/post",
  requireAuth(["admin"]),
  requireDatabase,
  async (req, res) => {
    const title = String(req.body.title || "").trim();
    const content = String(
      req.body.content || req.body.description || ""
    ).trim();
    const excerptFromBody = String(req.body.excerpt || "").trim();
    const excerpt = excerptFromBody || content.slice(0, 120);
    const author =
      String(req.body.author || req.user.name || "Admin").trim() || "Admin";

    const requestedSlug = toSlug(String(req.body.slug || title));
    const slug = await buildUniqueSlug(requestedSlug);
    console.log("Creating post with data:", {
      title,
      content,
      excerpt,
      author,
      slug,
    });
    const post = await Post.create({
      slug,
      title,
      excerpt,
      content,
      author,
      comments: [],
    });

    return res.status(201).json({
      message: "Post created successfully",
      post,
    });
  }
);

app.put(
  "/api/post/:slug",
  requireAuth(["admin"]),
  requireDatabase,
  async (req, res) => {
    const slug = String(req.params.slug || "").trim();

    if (!slug) {
      return res.status(400).json({ message: "Slug is required" });
    }

    const post = await Post.findOne({ slug });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const title = String(req.body.title ?? post.title).trim();
    const content = String(req.body.content ?? post.content).trim();
    const rawExcerpt = req.body.excerpt;
    let excerpt =
      rawExcerpt !== undefined ? String(rawExcerpt).trim() : post.excerpt;
    const author =
      String(req.body.author ?? post.author).trim() || post.author || "Admin";

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    if (!excerpt) {
      excerpt = content.slice(0, 120);
    }

    let nextSlug = post.slug;
    if (req.body.slug !== undefined) {
      const requestedSlug = toSlug(String(req.body.slug || title));
      if (requestedSlug && requestedSlug !== post.slug) {
        nextSlug = await buildUniqueSlugForUpdate(requestedSlug, post._id);
      }
    }

    post.slug = nextSlug;
    post.title = title;
    post.excerpt = excerpt;
    post.content = content;
    post.author = author;

    await post.save();

    return res.status(200).json({
      message: "Post updated successfully",
      post,
    });
  }
);

app.delete(
  "/api/post/:slug",
  requireAuth(["admin"]),
  requireDatabase,
  async (req, res) => {
    const slug = String(req.params.slug || "").trim();

    if (!slug) {
      return res.status(400).json({ message: "Slug is required" });
    }

    const post = await Post.findOneAndDelete({ slug });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({ message: "Post deleted successfully" });
  }
);
app.post(
  "/api/newregister",
  requireAuth(["admin"]),
  requireDatabase,
  async (req, res) => {
    const id = Number(req.body.id);
    const name = String(req.body.name).trim();
    const age = Number(req.body.id);
    const cv = String(req.body.output).trim();
    const register = await Register.create({
      id,
      name,
      age,
      cv,
    });
    console.log(id, name, age, cv);
    return res.status(202).json({ message: "Register created successfully" });
    // }
    // catch (error) {
    //     return res.status(500).json({ message: "Failed to create predict", error: error.message });
    // }
  }
);
app.post(
  "/api/newpredict",
  requireAuth(["admin"]),
  requireDatabase,
  async (req, res) => {
    // try {
    const id = Number(req.body.id);
    const name = String(req.body.name).trim();
    const input = String(req.body.input).trim();
    const output = String(req.body.output).trim();
    const predict = await Predict.create({
      id,
      name,
      input,
      output,
    });
    console.log(id, name, input, output);
    return res.status(202).json({ message: "Predict created successfully" });
    // }
    // catch (error) {
    //     return res.status(500).json({ message: "Failed to create predict", error: error.message });
    // }
  }
);

app.post(
  "/api/newnotification",
  requireAuth(["admin"]),
  requireDatabase,
  async (req, res) => {
    try {
      const id = Number(req.body.id);
      const name = String(req.body.name).trim();
      const noidung = String(req.body.noidung).trim();
      console.log({ id, name, noidung });
      if (!Number.isFinite(id) || id <= 0) {
        return res.status(400).json({ message: "Id is required" });
      }
      if (!name) {
        return res.status(400).json({ message: "Name are requried" });
      }
      if (!noidung) {
        return res.status(400).json({ message: "Noi dung are requried" });
      }
      const noti = await Noti.create({
        id,
        name,
        noidung,
      });
      return res
        .status(201)
        .json({ message: "Notification created successfully", noti });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to create notification",
        error: error.message,
      });
    }
  }
);

app.post(
  "/api/newuser",
  requireAuth(["admin"]),
  requireDatabase,
  async (req, res) => {
    try {
      const name = String(req.body.name || "").trim();
      const rawAge = String(req.body.age || "").trim();
      const age = rawAge ? Number(rawAge) : undefined;
      const address = String(req.body.address || "").trim();
      console.log("Received new user data:", { name, age, address });
      if (!name) {
        return res.status(400).json({ message: "Name are required" });
      }
      const user = await User.create({
        name,
        age,
        address,
      });

      return res.status(201).json({
        message: "User created successfully",
        user,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to create user",
        error: error.message,
      });
    }
  }
);

app.post("/api/comment", requireAuth(), requireDatabase, async (req, res) => {
  try {
    const slug = String(req.body.slug || "").trim();
    const content = String(req.body.content || "").trim();
    const author =
      String(req.user.name || req.user.username || "Anonymous").trim() ||
      "Anonymous";

    if (!slug || !content) {
      return res.status(400).json({ message: "Slug and content are required" });
    }

    const post = await Post.findOne({ slug });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.unshift({
      content,
      author,
    });

    await post.save();

    return res.status(201).json({
      message: "Comment created successfully",
      comment: post.comments[0],
      comments: post.comments,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create comment",
      error: error.message,
    });
  }
});

app.post("/api/login", (req, res) => {
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "").trim();

  const matchedUser = authenticateUser(username, password);

  if (matchedUser) {
    const user = toLoginPayload(matchedUser);

    return res.status(200).json({
      message: "Login successful",
      user,
      token: createToken(user),
    });
  } else {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }
});

app.post("/api/login/admin", (req, res) => {
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "").trim();

  const matchedUser = authenticateUser(username, password, ["admin"]);

  if (matchedUser) {
    const user = toLoginPayload(matchedUser);

    return res.status(200).json({
      message: "Login successful",
      user,
      token: createToken(user),
    });
  }

  return res.status(401).json({
    message: "Invalid username or password",
  });
});

app.post("/api/login/normal", (req, res) => {
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "").trim();

  const matchedUser = authenticateUser(username, password, ["user"]);

  if (matchedUser) {
    const user = toLoginPayload(matchedUser);

    return res.status(200).json({
      message: "Login successful",
      user,
      token: createToken(user),
    });
  }

  return res.status(401).json({
    message: "Invalid username or password",
  });
});

app.get("/api/about-login-user", (req, res) => {
  const loginUser = USERS[0];

  if (!loginUser) {
    return res.status(404).json({
      message: "No login user configured in server",
    });
  }

  return res.status(200).json({
    username: loginUser.username,
    password: loginUser.password,
    name: loginUser.name,
    role: loginUser.role,
    users: USERS.map((user) => ({
      username: user.username,
      name: user.name,
      role: user.role,
    })),
  });
});

const MONGODB_URI = process.env.MONGODB_URI;

function startHttpServer() {
  app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}!`);
  });
}

async function startServer() {
  if (!MONGODB_URI) {
    if (ALLOW_START_WITHOUT_DB) {
      console.warn(
        "Missing MONGODB_URI in .env file. Starting without DB connection."
      );
      startHttpServer();
      return;
    }

    console.error("Missing MONGODB_URI in .env file");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully");
    startHttpServer();
  } catch (error) {
    if (/auth|authentication/i.test(error.message)) {
      console.error(
        "MongoDB authentication failed. Check username/password in MONGODB_URI and URL-encode special characters in password."
      );
    }

    if (ALLOW_START_WITHOUT_DB) {
      console.warn(
        "Starting without DB connection because ALLOW_START_WITHOUT_DB=true."
      );
      startHttpServer();
      return;
    }

    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();

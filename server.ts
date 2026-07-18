import express from 'express';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'diwan_namak_mandi_secret_key_2026';
const getDatabasePath = () => {
  const pathsToTry = [
    path.join(process.cwd(), 'src', 'db', 'data.json'),
    path.join(__dirname, '..', 'src', 'db', 'data.json'),
    path.join(__dirname, 'src', 'db', 'data.json'),
    path.resolve(process.cwd(), 'src', 'db', 'data.json'),
    path.resolve(__dirname, '..', 'src', 'db', 'data.json')
  ];

  for (const p of pathsToTry) {
    if (fs.existsSync(p)) {
      console.log(`[Database] Found database at: ${p}`);
      return p;
    }
  }

  // Default fallback path
  return path.join(process.cwd(), 'src', 'db', 'data.json');
};

const DB_PATH = getDatabasePath();
const DB_DIR = path.dirname(DB_PATH);

// Interface definitions matching src/types.ts
interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  type: 'home' | 'table';
  tableNumber?: string;
  status: 'pending' | 'preparing' | 'completed' | 'cancelled';
  createdAt: string;
}

interface Booking {
  id: string;
  userId?: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

interface DbUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: 'customer' | 'admin';
}

interface RestaurantSettings {
  name: string;
  location: string;
  phone: string;
  email: string;
  openingHours: string;
  whatsappEnabled: boolean;
  whatsappNumber: string;
  bannerImage: string;
  bannerTitle: string;
  bannerSubtitle: string;
}

interface DatabaseSchema {
  users: DbUser[];
  menu: MenuItem[];
  orders: Order[];
  bookings: Booking[];
  settings?: RestaurantSettings;
}

// Global Default Lists for robust self-healing
const salt = bcrypt.genSaltSync(10);
const defaultUsers: DbUser[] = [
  {
    id: 'u1',
    name: 'Deewan Admin',
    email: 'admin@deewan.com',
    phone: '+92 300 1234567',
    passwordHash: bcrypt.hashSync('admin', salt),
    role: 'admin'
  },
  {
    id: 'u2',
    name: 'Sheraz Hussain',
    email: 'customer@deewan.com',
    phone: '+92 312 9876543',
    passwordHash: bcrypt.hashSync('customer', salt),
    role: 'customer'
  }
];

const defaultMenu: MenuItem[] = [
  {
    id: "m1",
    name: "Shinwari Mutton Tikka",
    price: 1150,
    category: "BBQ",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRlDoYC1PEv0VJeq3IP6-GUuzNOTEC_A7EH8JetEvlMw&s=10",
    description: "Charcoal-grilled Peshawari Mutton Tikka skewers, lightly salted and grilled on open coal for authentic Namak Mandi flavour."
  },
  {
    id: "m2",
    name: "Peshawari Chapli Kabab",
    price: 450,
    category: "BBQ",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRe_t6BxWzsp-FIJqgJzpmvxrOY2Y0sKUYhWbqnbIruQQ&s=10",
    description: "Traditional minced beef kabab with chopped onions, tomatoes, pomegranate seeds, and native spices, fried on flat griddle."
  },
  {
    id: "m3_3",
    name: "Chicken Malai Boti",
    price: 820,
    category: "BBQ",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZozuC1taDdcI-_Qp4zzbns3BNqhTu1Z5n9bfv37wVRw&s=10",
    description: "Succulent, melt-in-mouth boneless chicken boti marinated in fresh heavy cream, yogurt, and green cardamom."
  },
  {
    id: "m4",
    name: "Namak Mandi Mutton Karahi",
    price: 1850,
    category: "Karahi",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8Kc9pQykRbB3Nw0FuMOVXL-TekUdFoNr52f39RhMmlw&s=10",
    description: "Authentic Namak Mandi Mutton Karahi cooked in animal fat with only salt, ginger, tomatoes, and green chilies."
  },
  {
    id: "m5_4",
    name: "Traditional Beef Karahi",
    price: 1450,
    category: "Karahi",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiNy14UikSg6RCNm1XSqriezFGk0qCP5_TcZ9IBKIj-w&s=10",
    description: "Tender boneless beef chunks slow-cooked with fresh ginger, garlic, ripe tomatoes, and freshly ground spices."
  },
  {
    id: "m6",
    name: "Special Roghni Naan",
    price: 60,
    category: "Roti",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqJabLfY5Mr2AbctS2isrScbwJJQGPQDEJOKA-WvKsmw&s=10",
    description: "Tandoori naan topped with sesame seeds and brushed with melted butter, baked live in clay tandoor."
  },
  {
    id: "m7_2",
    name: "Garlic Coriander Naan",
    price: 90,
    category: "Roti",
    image: "/src/assets/images/garlic_naan_1784187142918.jpg",
    description: "Freshly tandoor-baked naan infused with aromatic minced garlic and fresh coriander leaves, brushed with pure ghee."
  },
  {
    id: "m7_3",
    name: "Sada Tandoori Naan",
    price: 40,
    category: "Roti",
    image: "/src/assets/images/tandoori_naan_1784192537211.jpg",
    description: "Plain, fresh clay-oven baked traditional naan with light golden char marks and puffy bubbles."
  },
  {
    id: "m8",
    name: "Traditional Sweet Lassi",
    price: 180,
    category: "Drinks",
    image: "/src/assets/images/sweet_lassi_1784187162495.jpg",
    description: "Creamy yogurt drink blended with sugar, ice, and dynamic thick pakistani milk."
  },
  {
    id: "m9_3",
    name: "Karak Chai (Special Doodh Patti)",
    price: 120,
    category: "Drinks",
    image: "/src/assets/images/karak_chai_1784192272196.jpg",
    description: "Rich, strong cardamom tea slow-brewed with fresh whole milk in traditional style."
  },
  {
    id: "m9_5",
    name: "Gourmet Soft Drinks",
    price: 90,
    category: "Drinks",
    image: "/src/assets/images/soft_drinks_1784192303831.jpg",
    description: "Your choice of classic chilled carbonated soft drinks (Pepsi, Sprite, 7Up, or Fanta) served with ice."
  },
  {
    id: "m10",
    name: "Special Chicken Biryani",
    price: 450,
    category: "Rice",
    image: "/src/assets/images/chicken_biryani_1784193875562.jpg",
    description: "Fragrant long-grain basmati rice cooked with layered spiced chicken, potatoes, saffron, and mint, in authentic Karachi style."
  },
  {
    id: "m10_2",
    name: "Peshawari Kabuli Pulao",
    price: 650,
    category: "Rice",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=800",
    description: "Authentic Afghan/Peshawari style steamed rice cooked in rich lamb stock, crowned with sweet caramelized carrots and black raisins."
  },
  {
    id: "m11_2",
    name: "Special Podina Raita",
    price: 120,
    category: "Raita & Salad",
    image: "https://lh3.googleusercontent.com/d/1mx6e5I3pC9yYdcIwcQNbiw5CN4CLQrzc",
    description: "Creamy whipped yogurt infused with a fresh vibrant blend of mint leaves, green chilies, and coriander."
  },
  {
    id: "m11_3",
    name: "Fresh Kachumar Salad",
    price: 150,
    category: "Raita & Salad",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800",
    description: "Traditional Pakistani crunchy salad of finely diced cucumbers, ripe tomatoes, red onions, fresh coriander, and a squeeze of fresh lemon."
  },
  {
    id: "m_5nxgcpyrv",
    name: "green boti",
    price: 1200,
    category: "BBQ",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVzDzO4i-VrXX4fKlFbfizZl3TYyjOBE1r05zgXSamfg&s=10",
    description: "spicy"
  }
];

const defaultBookings: Booking[] = [
  {
    id: 'b1',
    userId: 'u2',
    name: 'Sheraz Hussain',
    phone: '+92 312 9876543',
    date: '2026-07-20',
    time: '19:30',
    guests: 4,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  }
];

const defaultOrders: Order[] = [
  {
    id: 'o1',
    userId: 'u2',
    customerName: 'Sheraz Hussain',
    customerPhone: '+92 312 9876543',
    items: [
      { id: 'm1', name: 'Shinwari Mutton Tikka', price: 1150, quantity: 1 },
      { id: 'm4', name: 'Namak Mandi Mutton Karahi', price: 1850, quantity: 1 },
      { id: 'm6', name: 'Special Roghni Naan', price: 60, quantity: 4 }
    ],
    subtotal: 3240,
    tax: 162,
    total: 3402,
    type: 'table',
    tableNumber: '5',
    status: 'completed',
    createdAt: new Date().toISOString()
  }
];

// Ensure Database exists with default data
function initDatabase() {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_PATH)) {
      const initialDb: DatabaseSchema = {
        users: defaultUsers,
        menu: defaultMenu,
        orders: defaultOrders,
        bookings: defaultBookings
      };
      fs.writeFileSync(DB_PATH, JSON.stringify(initialDb, null, 2), 'utf-8');
      console.log('[Database] Database initialized successfully with default entries.');
    } else {
      // Validate existing file is not empty/corrupted
      const stats = fs.statSync(DB_PATH);
      if (stats.size === 0) {
        console.warn('[Database] DB_PATH is empty (0 bytes). Re-initializing with default entries.');
        const initialDb: DatabaseSchema = {
          users: defaultUsers,
          menu: defaultMenu,
          orders: defaultOrders,
          bookings: defaultBookings
        };
        fs.writeFileSync(DB_PATH, JSON.stringify(initialDb, null, 2), 'utf-8');
      }
    }
  } catch (err) {
    console.error('[Database] Error initializing database:', err);
  }
}

initDatabase();

// Helper functions for DB reading and writing with auto-healing fallback
function readDb(): DatabaseSchema {
  const defaultSettings: RestaurantSettings = {
    name: 'Deewan Namak Mandi',
    location: 'Circular Road, near Town Hall, Dera Ismail Khan, Pakistan',
    phone: '+92 300 1234567',
    email: 'orders@deewan.com',
    openingHours: 'Monday - Sunday: 12:00 PM - 01:00 AM',
    whatsappEnabled: true,
    whatsappNumber: '+923001234567',
    bannerImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1600',
    bannerTitle: 'Sizzling Namak Mandi Karahi & Charcoal BBQ',
    bannerSubtitle: 'The Authentic Taste of Dera Ismail Khan'
  };

  try {
    if (!fs.existsSync(DB_PATH)) {
      initDatabase();
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    if (!data || data.trim() === '') {
      throw new Error('Database file is completely empty');
    }
    const db: DatabaseSchema = JSON.parse(data);
    
    // Ensure lists are always valid arrays
    let changed = false;
    if (!db.users || !Array.isArray(db.users)) { db.users = defaultUsers; changed = true; }
    if (!db.menu || !Array.isArray(db.menu) || db.menu.length === 0) { db.menu = defaultMenu; changed = true; }
    if (!db.orders || !Array.isArray(db.orders)) { db.orders = defaultOrders; changed = true; }
    if (!db.bookings || !Array.isArray(db.bookings)) { db.bookings = defaultBookings; changed = true; }
    if (!db.settings) { db.settings = defaultSettings; changed = true; }
    
    if (changed) {
      console.warn('[Database] Database structure was healed/re-populated. Saving clean state...');
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
    }
    
    return db;
  } catch (err) {
    console.error('[Database] Failed to read database, returning default fallback:', err);
    return {
      users: defaultUsers,
      menu: defaultMenu,
      orders: defaultOrders,
      bookings: defaultBookings,
      settings: defaultSettings
    };
  }
}

function writeDb(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Database] Error writing DB:', err);
  }
}

// Authentication Middleware
interface CustomRequest extends express.Request {
  user?: {
    id: string;
    role: 'customer' | 'admin';
    email: string;
  };
}

function authenticateToken(req: CustomRequest, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      res.status(403).json({ error: 'Invalid or expired token' });
      return;
    }
    req.user = user;
    next();
  });
}

function requireAdmin(req: CustomRequest, res: express.Response, next: express.NextFunction) {
  authenticateToken(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Admin access required' });
    }
  });
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API: Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date() });
  });

  // API: Authentication - Signup
  app.post('/api/auth/signup', (req, res) => {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    const db = readDb();
    const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const newUser: DbUser = {
      id: 'u_' + Math.random().toString(36).substr(2, 9),
      name,
      email: email.toLowerCase(),
      phone,
      passwordHash: bcrypt.hashSync(password, salt),
      role: 'customer'
    };

    db.users.push(newUser);
    writeDb(db);

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      }
    });
  });

  // API: Authentication - Login
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const db = readDb();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      res.status(400).json({ error: 'Invalid email or password' });
      return;
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ error: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  });

  // API: Authentication - Get Current User
  app.get('/api/auth/me', authenticateToken, (req: CustomRequest, res) => {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const db = readDb();
    const user = db.users.find(u => u.id === req.user?.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  });

  // API: Menu - Get all items
  app.get('/api/menu', (req, res) => {
    const db = readDb();
    res.json(db.menu);
  });

  // API: Menu - Add new item (Admin)
  app.post('/api/menu', requireAdmin, (req, res) => {
    const { name, price, category, image, description } = req.body;
    if (!name || price === undefined || !category || !image || !description) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    const db = readDb();
    const newItem: MenuItem = {
      id: 'm_' + Math.random().toString(36).substr(2, 9),
      name,
      price: Number(price),
      category,
      image,
      description
    };

    db.menu.push(newItem);
    writeDb(db);
    res.status(201).json(newItem);
  });

  // API: Menu - Update item (Admin)
  app.put('/api/menu/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const { name, price, category, image, description } = req.body;

    const db = readDb();
    const index = db.menu.findIndex(item => item.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Menu item not found' });
      return;
    }

    db.menu[index] = {
      ...db.menu[index],
      name: name ?? db.menu[index].name,
      price: price !== undefined ? Number(price) : db.menu[index].price,
      category: category ?? db.menu[index].category,
      image: image ?? db.menu[index].image,
      description: description ?? db.menu[index].description
    };

    writeDb(db);
    res.json(db.menu[index]);
  });

  // API: Menu - Delete item (Admin)
  app.delete('/api/menu/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const db = readDb();
    const index = db.menu.findIndex(item => item.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Menu item not found' });
      return;
    }

    const deletedItem = db.menu.splice(index, 1)[0];
    writeDb(db);
    res.json({ message: 'Menu item deleted successfully', deletedItem });
  });

  // API: Orders - Get Orders (Admin views all, Customer views their history)
  app.get('/api/orders', authenticateToken, (req: CustomRequest, res) => {
    const db = readDb();
    if (req.user?.role === 'admin') {
      res.json(db.orders);
    } else {
      const userOrders = db.orders.filter(order => order.userId === req.user?.id);
      res.json(userOrders);
    }
  });

  // API: Orders - Place a new order
  app.post('/api/orders', (req, res) => {
    const { userId, customerName, customerPhone, items, subtotal, tax, total, type, tableNumber } = req.body;

    if (!customerName || !customerPhone || !items || !items.length || subtotal === undefined || total === undefined || !type) {
      res.status(400).json({ error: 'Missing required order details' });
      return;
    }

    const db = readDb();
    const newOrder: Order = {
      id: 'o_' + Math.random().toString(36).substr(2, 9),
      userId,
      customerName,
      customerPhone,
      items,
      subtotal: Number(subtotal),
      tax: Number(tax || 0),
      total: Number(total),
      type,
      tableNumber,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    db.orders.unshift(newOrder);
    writeDb(db);
    res.status(201).json(newOrder);
  });

  // API: Orders - Update Order Status (Admin)
  app.put('/api/orders/:id/status', requireAdmin, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'preparing', 'completed', 'cancelled'].includes(status)) {
      res.status(400).json({ error: 'Invalid order status' });
      return;
    }

    const db = readDb();
    const index = db.orders.findIndex(order => order.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    db.orders[index].status = status;
    writeDb(db);
    res.json(db.orders[index]);
  });

  // API: Bookings - Get Bookings (Admin views all, Customer views theirs)
  app.get('/api/bookings', authenticateToken, (req: CustomRequest, res) => {
    const db = readDb();
    if (req.user?.role === 'admin') {
      res.json(db.bookings);
    } else {
      const userBookings = db.bookings.filter(booking => booking.userId === req.user?.id);
      res.json(userBookings);
    }
  });

  // API: Bookings - Create Booking
  app.post('/api/bookings', (req, res) => {
    const { userId, name, phone, date, time, guests } = req.body;

    if (!name || !phone || !date || !time || !guests) {
      res.status(400).json({ error: 'All reservation fields are required' });
      return;
    }

    const db = readDb();
    const newBooking: Booking = {
      id: 'b_' + Math.random().toString(36).substr(2, 9),
      userId,
      name,
      phone,
      date,
      time,
      guests: Number(guests),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    db.bookings.unshift(newBooking);
    writeDb(db);
    res.status(201).json(newBooking);
  });

  // API: Bookings - Update Booking Status (Admin)
  app.put('/api/bookings/:id/status', requireAdmin, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
      res.status(400).json({ error: 'Invalid booking status' });
      return;
    }

    const db = readDb();
    const index = db.bookings.findIndex(booking => booking.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    db.bookings[index].status = status;
    writeDb(db);
    res.json(db.bookings[index]);
  });

  // API: Users - Get all users (Admin only)
  app.get('/api/users', requireAdmin, (req, res) => {
    const db = readDb();
    const sanitizedUsers = db.users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role
    }));
    res.json(sanitizedUsers);
  });

  // API: Orders - Delete an order (Admin only)
  app.delete('/api/orders/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const db = readDb();
    const index = db.orders.findIndex(order => order.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    const deletedOrder = db.orders.splice(index, 1)[0];
    writeDb(db);
    res.json({ message: 'Order deleted successfully', deletedOrder });
  });

  // API: Settings - Get restaurant settings
  app.get('/api/settings', (req, res) => {
    const db = readDb();
    res.json(db.settings);
  });

  // API: Settings - Update restaurant settings (Admin only)
  app.put('/api/settings', requireAdmin, (req, res) => {
    const db = readDb();
    db.settings = {
      ...db.settings,
      ...req.body
    };
    writeDb(db);
    res.json(db.settings);
  });

  // Serve the /src/assets directory as static files in both production and development
  app.use('/src/assets', express.static(path.join(process.cwd(), 'src', 'assets')));

  // Handle front-end code with Vite inside dev environment, or serve statics
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});

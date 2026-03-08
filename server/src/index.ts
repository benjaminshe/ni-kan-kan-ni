import express from "express";
import cors from "cors";
import sessionRoutes from "./routes/sessions";
import categoryRoutes from "./routes/categories";
import contentRecordRoutes from "./routes/content-records";
import reportRoutes from "./routes/reports";

const app = express();
const port = process.env.PORT || 9091;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check
app.get('/api/v1/health', (req, res) => {
  console.log('Health check success');
  res.status(200).json({ status: 'ok' });
});

// API Routes
app.use('/api/v1/sessions', sessionRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/content-records', contentRecordRoutes);
app.use('/api/v1/reports', reportRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}/`);
});

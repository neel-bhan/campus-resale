# Environment Variables Reference

## Backend Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```bash
# Server
PORT=3001
NODE_ENV=production

# Database (PostgreSQL)
DB_HOST=your-database-host
DB_PORT=5432
DB_NAME=your-database-name
DB_USER=your-database-user
DB_PASSWORD=your-database-password

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-generate-a-random-string

# AWS S3 (for image storage)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-bucket-name

# CORS (comma-separated list of allowed origins)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Example for Production:
```bash
PORT=3001
NODE_ENV=production
DB_HOST=your-railway-db-host.railway.app
DB_PORT=5432
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=your-railway-password
JWT_SECRET=your-random-secret-key-min-32-characters
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=campus-resale-images
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## Frontend Environment Variables

Create a `.env` or `.env.production` file in the `frontend/` directory:

```bash
# API Configuration
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_BACKEND_URL=https://api.yourdomain.com
```

### For Local Development:
```bash
VITE_API_BASE_URL=http://localhost:3001/api
VITE_BACKEND_URL=http://localhost:3001
```

### For Production (Cloudflare Pages/Vercel):
Set these in your hosting platform's environment variables section:
- `VITE_API_BASE_URL=https://your-backend.railway.app/api`
- `VITE_BACKEND_URL=https://your-backend.railway.app`

## Generating a JWT Secret

You can generate a secure random string for JWT_SECRET using:

```bash
# On macOS/Linux:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using openssl:
openssl rand -hex 32
```

## Security Notes

1. **Never commit `.env` files to git** - they're already in `.gitignore`
2. **Use different secrets for development and production**
3. **Rotate secrets periodically**
4. **Keep AWS credentials secure** - consider using IAM roles if possible
5. **Use environment variables in your hosting platform** - don't hardcode them


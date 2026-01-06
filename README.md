# Mango Admi Backend API

Complete backend solution for Mango Admi - Achieve Your Goals platform with database and email functionality.

## Features

- ✅ **User Management** - User registration with password hashing
- ✅ **Contact Form** - Handle contact submissions from frontend
- ✅ **Email Notifications** - Nodemailer integration for:
  - Sending form data to admin/owner
  - Auto-response emails to clients
  - Welcome emails for new users
- ✅ **MongoDB Database** - Stores user details and contact submissions
- ✅ **CORS Support** - Frontend-backend integration
- ✅ **Error Handling** - Comprehensive error management
- ✅ **Validation** - Input validation for all endpoints

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts       # MongoDB connection
│   │   └── mailer.ts         # Nodemailer configuration
│   ├── models/
│   │   ├── User.ts           # User schema with password hashing
│   │   └── ContactForm.ts    # Contact form schema
│   ├── controllers/
│   │   ├── userController.ts # User endpoints
│   │   └── contactController.ts # Contact form endpoints
│   ├── routes/
│   │   ├── userRoutes.ts     # User routes
│   │   └── contactRoutes.ts  # Contact routes
│   ├── services/
│   │   └── emailService.ts   # Email sending service
│   └── index.ts              # Main server file
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your configuration:

```bash
cp .env.example .env
```

Edit `.env` with your values:
- **MongoDB**: Your MongoDB connection string
- **SMTP**: Gmail or your email provider credentials
- **Admin Email**: Where to send contact form submissions
- **Owner Email**: Contact email for form submissions

### 3. Setup MongoDB

- **Local**: Install MongoDB and run it locally (default: `mongodb://localhost:27017`)
- **Cloud**: Use MongoDB Atlas and update `MONGODB_URI`

### 4. Setup Email (Nodemailer)

For **Gmail**:
1. Enable 2-factor authentication
2. Create an [App Password](https://myaccount.google.com/apppasswords)
3. Use the app password in `.env` as `SMTP_PASS`

Or use any other SMTP provider.

### 5. Run Development Server

```bash
npm run dev
```

Server will start on `http://localhost:5000`

### 6. Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### User Endpoints

#### Sign Up
- **POST** `/api/users/signup`
- Body:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "password": "password123",
    "confirmPassword": "password123",
    "agreeToTerms": true
  }
  ```

#### Get User
- **GET** `/api/users/:id`

#### Get All Users
- **GET** `/api/users`

#### Update User
- **PUT** `/api/users/:id`
- Body: (any of the fields)
  ```json
  {
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "9876543211"
  }
  ```

#### Delete User
- **DELETE** `/api/users/:id`

### Contact Form Endpoints

#### Submit Contact Form
- **POST** `/api/contact/submit`
- Body:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "message": "I'm interested in your services",
    "subject": "Service Inquiry",
    "serviceType": "Business"
  }
  ```
- Response: "Your message has been received. We will contact you soon!"
- **Actions**:
  - Stores submission in database
  - Sends form details to admin email
  - Sends auto-response to client

#### Get All Contact Forms
- **GET** `/api/contact`

#### Get Specific Contact Form
- **GET** `/api/contact/:id`

#### Delete Contact Form
- **DELETE** `/api/contact/:id`

### Health Check
- **GET** `/api/health` - Returns server status

## Environment Variables

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/mango-admi
DATABASE_NAME=mango-admi

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:8081

# Email Configuration (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
OWNER_EMAIL=owner@mangoadmi.com
FROM_EMAIL=noreply@mangoadmi.com
ADMIN_EMAIL=admin@mangoadmi.com

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
```

## Frontend Integration

### Update your frontend to call the backend API

In your React components, replace the local state handling with API calls:

```typescript
// Example for SignUp form
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const response = await fetch('http://localhost:5000/api/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      toast.success(data.message);
      // Reset form
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error('An error occurred');
  }
};
```

### Example for Contact Form

```typescript
const handleContactSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const response = await fetch('http://localhost:5000/api/contact/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      toast.success(data.message); // "Your message has been received..."
      // Reset form
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error('Failed to submit form');
  }
};
```

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  agreeToTerms: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### ContactForm Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  message: String,
  subject: String,
  serviceType: String (enum: Individual, Business, Combo, Investments, 1-1, Other),
  createdAt: Date,
  updatedAt: Date
}
```

## Email Templates

### Contact Form to Admin
- Shows all form details
- Includes submission timestamp
- Ready for admin review

### Auto-response to Client
- Personalized greeting
- Confirms message receipt
- Sets expectations (24-48 hour response)

### Welcome Email to New User
- Thanks for registration
- Sets expectations for next steps

## Error Handling

The API returns standard HTTP status codes:
- **201** - Resource created
- **200** - Success
- **400** - Bad request (validation errors)
- **404** - Not found
- **409** - Conflict (duplicate email)
- **500** - Server error

Error responses include:
```json
{
  "message": "Error description"
}
```

## Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **nodemailer** - Email service
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables
- **cors** - Cross-origin requests
- **typescript** - Type safety
- **tsx** - TypeScript execution

## Development Tips

1. **Check MongoDB Connection**: Visit MongoDB Atlas dashboard
2. **Test Email**: Check spam folder for test emails
3. **Debug**: Use `console.log()` - logs are shown in terminal
4. **Database**: Use MongoDB Compass to view/edit data
5. **CORS Issues**: Ensure `FRONTEND_URL` matches your frontend URL

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Setup `.env` file with your credentials
3. ✅ Run MongoDB (local or cloud)
4. ✅ Start server: `npm run dev`
5. ✅ Update frontend API endpoints
6. ✅ Test endpoints with Postman/Insomnia
7. ✅ Deploy to production (Vercel, Heroku, AWS, etc.)

## Support

For issues or questions:
- Check `.env` configuration
- Verify MongoDB connection
- Check email service credentials
- Review error messages in terminal

---

**Backend by Mango Admi Team**

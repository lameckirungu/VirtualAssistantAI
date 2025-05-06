# AI-Powered Virtual Assistant for Business Optimization

A sophisticated web application designed for Kenyan businesses to streamline inventory management, order processing, and customer support through an intelligent AI chatbot interface.

![AI Virtual Assistant Dashboard](/images/dashboard.png)

## Overview

This application leverages natural language processing (NLP) and machine learning to create a conversational interface that helps business owners manage their operations. It's specifically tailored for the Kenyan market with support for Kenyan Shilling (KSh) currency and local product offerings.

## Key Features

- **AI-Powered Chat Interface**: Interact with your business data using natural language.
- **Intent Classification**: The system intelligently categorizes user queries to provide appropriate responses.
- **Entity Extraction**: Extracts relevant information from user messages.
- **Inventory Management**: Track products, manage stock levels, and receive low-stock alerts.
- **Order Processing**: View, manage, and update order statuses.
- **Business Analytics**: Get insights into sales, inventory, and customer interactions.
- **Secure Authentication**: Role-based access control system.
- **Kenya-Specific Optimization**: Prices in KSh, with product listings relevant to the Kenyan market.

## Technology Stack

### Frontend
- React with TypeScript
- Shadcn/UI component library with Tailwind CSS
- TanStack Query for server state management
- Wouter for lightweight routing

### Backend
- Node.js with Express
- PostgreSQL database with Drizzle ORM
- Passport.js for authentication
- OpenAI integration for advanced NLP capabilities

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- OpenAI API key

### Environment Variables
Create a `.env` file with the following variables:
```
DATABASE_URL=<your-postgresql-connection-string>
OPENAI_API_KEY=<your-openai-api-key>
SESSION_SECRET=<your-session-secret>
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-business-assistant.git
cd ai-business-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npm run db:push
```

4. Start the development server:
```bash
npm run dev
```

## Usage

### Chat Interface
- Use the chat to ask about inventory, check order status, or inquire about products.
- Example queries:
  - "How many M-KOPA Solar Home Systems do we have in stock?"
  - "What's the status of order KE23050004?"
  - "Show me all products in the Kitchen category."

### Inventory Management
Navigate to the Inventory page to:
- View all products with stock levels
- Add new products
- Update existing product information
- Check for low stock items

### Order Processing
Use the Orders page to:
- View all orders
- Update order status
- Check order details
- Search for specific orders

### Analytics
Access the Analytics page for:
- Sales insights
- Inventory movement trends
- Customer interaction metrics
- Popular product analysis

## AI Capabilities

The system can understand and respond to various intents:
- Product inquiries
- Inventory checks
- Order status requests
- General business inquiries

The NLP system uses a combination of:
- Rule-based intent classification
- Entity extraction
- OpenAI's language models for advanced understanding

## Security Features

- Secure authentication with password hashing
- Session management with PostgreSQL session store
- Role-based access control
- Input validation and sanitization

## Customization

The application can be extended with:
- Additional product categories
- Custom report generation
- External service integrations (e.g., M-Pesa, shipping providers)
- Enhanced AI training for specific business domains

## Contributing

We welcome contributions to improve this business assistant! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- OpenAI for providing the AI capabilities
- Shadcn for the UI component library
- The Kenyan business community for inspiration and feedback
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";


interface SwaggerOptions {
  definition: {
    openapi: string;
    info: {
      title: string;
      version: string;
      description: string;
    };
    servers: {
      url: string;
    }[];
    components: {
      securitySchemes: {
        bearerAuth: {
          type: string;
          scheme: string;
          bearerFormat: string;
        };
      };
    };
  };
  apis: string[];
}

const options: SwaggerOptions = {
  definition: {
    openapi: "3.0.0", 
    info: {
      title: "API Chat2Desk",  
      version: "1.0.0", 
      description: "Uma API para autenticação de usuários", 
    },
    servers: [
      {
        url: "http://localhost:3000", 
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Formato JWT
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = {
  spec: swaggerSpec,
  ui: swaggerUi,
};

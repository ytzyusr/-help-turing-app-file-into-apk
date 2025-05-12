# Our Love App - Complete Code Reference

This file contains all the key code used to build the couples app with shared login functionality.

## 1. Authentication Page (client/src/pages/auth-page.tsx)

```tsx
import { useState, useContext, useEffect } from "react";
import { useLocation } from "wouter";
import { UserContext } from "../main.tsx";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  password: z.string().min(4, {
    message: "Password must be at least 4 characters.",
  }),
});

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { userId, setUserId, setUsername } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Redirect to home if already logged in
  useEffect(() => {
    if (userId) {
      setLocation("/");
    }
  }, [userId, setLocation]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const endpoint = isLogin ? "/api/login" : "/api/register";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || (isLogin ? "Login failed" : "Registration failed"));
      }

      const data = await response.json();
      setUserId(data.id);
      setUsername(data.username);
      
      toast({
        title: isLogin ? "Login successful" : "Registration successful",
        description: "Welcome to Our Love!",
      });
      
      setLocation("/");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-peach-light to-yellow-light">
      {/* Form Section */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex items-center justify-center">
        <motion.div 
          className="w-full max-w-md bg-white rounded-xl shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-6">
            <svg 
              width="40" 
              height="40" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-peach-dark animate-heart-beat"
            >
              <path 
                d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z" 
                fill="currentColor"
              />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-brown mb-6 font-script">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          
          <p className="text-brown-light text-center mb-6">
            Use a single account for both of you to access your shared memories.
          </p>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-brown">Username</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your shared username" 
                        {...field} 
                        className="border-peach-light focus:border-yellow focus:ring-yellow"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-brown">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter your password" 
                        {...field} 
                        className="border-peach-light focus:border-yellow focus:ring-yellow"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-peach hover:bg-peach-dark text-brown"
              >
                {isLogin ? "Login" : "Create Account"}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center">
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-brown-light hover:text-brown text-sm"
            >
              {isLogin ? "Don't have an account? Create one" : "Already have an account? Login"}
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Hero Section */}
      <div className="w-full md:w-1/2 bg-peach p-8 md:p-12 flex items-center justify-center">
        <motion.div 
          className="max-w-md text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-brown mb-6 font-script">Our Love</h1>
          <p className="text-brown-light mb-8">
            A special place for the two of you to share photos and memories together. 
            Create a shared account that both of you can use to access your precious moments.
          </p>
          
          <div className="relative">
            <div className="absolute -top-16 -left-12 opacity-30">
              <svg 
                width="64" 
                height="64" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-peach-dark"
              >
                <path 
                  d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z" 
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="absolute -bottom-8 -right-8 opacity-30">
              <svg 
                width="48" 
                height="48" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-yellow"
              >
                <path 
                  d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z" 
                  fill="currentColor"
                />
              </svg>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-brown">Features</h3>
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-peach-dark"
                >
                  <path 
                    d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z" 
                    fill="currentColor"
                  />
                </svg>
              </div>
              <ul className="text-left space-y-2 text-brown-light">
                <li className="flex items-center">
                  <span className="mr-2">❤️</span>
                  <span>One shared account for both of you</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📸</span>
                  <span>Share photos of your special moments</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📝</span>
                  <span>Write notes and messages to each other</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">🔒</span>
                  <span>Private space just for the two of you</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
```

## 2. Protected Route (client/src/lib/protected-route.tsx)

```tsx
import { useContext } from "react";
import { UserContext } from "../main.tsx";
import { Redirect, Route } from "wouter";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { userId } = useContext(UserContext);

  // If user is not logged in, redirect to auth page
  if (!userId) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // If user is logged in, render the component
  return <Route path={path} component={Component} />;
}
```

## 3. Backend Authentication (server/auth.ts)

```typescript
import type { Express, Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";

export function setupAuth(app: Express) {
  // Register endpoint
  app.post("/api/register", async (req: Request, res: Response) => {
    try {
      // Validate incoming data using the schema
      const userInput = insertUserSchema.safeParse(req.body);
      
      if (!userInput.success) {
        return res.status(400).json({ message: "Invalid user data", errors: userInput.error.errors });
      }
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userInput.data.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Create the user
      const user = await storage.createUser(userInput.data);
      
      // Return the user without the password
      return res.status(201).json({
        id: user.id,
        username: user.username
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Error creating account" });
    }
  });
  
  // Login endpoint
  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // Find the user
      const user = await storage.getUserByUsername(username);
      
      // Check if user exists and password matches
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Return the user without the password
      return res.status(200).json({
        id: user.id,
        username: user.username
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Error during login" });
    }
  });
  
  // Get current user endpoint
  app.get("/api/user", async (req: Request, res: Response) => {
    try {
      // For demonstration, we'll just use the userId from the query parameters
      // In a real app, this would come from sessions or tokens
      const userId = parseInt(req.query.userId as string);
      
      if (isNaN(userId)) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return the user without the password
      return res.status(200).json({
        id: user.id,
        username: user.username
      });
    } catch (error) {
      console.error("Get user error:", error);
      return res.status(500).json({ message: "Error retrieving user" });
    }
  });
}
```

## 4. Main.tsx with User Context (client/src/main.tsx)

```tsx
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { createContext, useState } from "react";

// Define the UserContext type
type UserContextType = {
  userId: number | null;
  setUserId: (id: number | null) => void;
  username: string | null;
  setUsername: (name: string | null) => void;
};

// Create the context with default values
export const UserContext = createContext<UserContextType>({
  userId: null,
  setUserId: () => {},
  username: null,
  setUsername: () => {},
});

// UserProvider component
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<number | null>(null); // Start with null to force login
  const [username, setUsername] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ userId, setUserId, username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

// Ensure we only create one root
let root: ReturnType<typeof createRoot>;

// Get the root element
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

// If we don't have a root yet, create it
if (!(window as any).__REACT_ROOT__) {
  root = createRoot(rootElement);
  (window as any).__REACT_ROOT__ = root;
} else {
  // Reuse the existing root
  root = (window as any).__REACT_ROOT__;
}

// Render the app
root.render(
  <UserProvider>
    <App />
  </UserProvider>
);
```

## 5. App.tsx with Protected Routes (client/src/App.tsx)

```tsx
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import AuthPage from "@/pages/auth-page";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Home} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
```

## 6. Capacitor Config for APK (capacitor.config.ts)

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ourlove.app',
  appName: 'Our Love',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
```

## 7. Heart Animation CSS (in client/src/index.css)

```css
@layer utilities {
  @keyframes heartBeat {
    0% {
      transform: scale(0.8);
    }
    14% {
      transform: scale(1.3);
    }
    28% {
      transform: scale(1);
    }
    42% {
      transform: scale(1.3);
    }
    70% {
      transform: scale(1);
    }
  }
  
  .animate-heart-beat {
    animation: heartBeat 1.5s ease-in-out;
  }
}
```

## 8. Colors and Theme (in client/src/index.css)

```css
:root {
  /* App specific colors */
  --peach-light: 16 100% 85%;
  --peach: 9 100% 79%;
  --peach-dark: 0 69% 76%;
  --yellow-light: 54 100% 97%;
  --yellow: 48 100% 50%;
  --yellow-dark: 37 100% 70%;
  --brown: 22 30% 28%;
  --brown-light: 22 20% 55%;
}

@layer components {
  .font-script {
    font-family: 'Dancing Script', cursive;
  }
  
  .bg-peach-light {
    background-color: hsl(var(--peach-light));
  }
  
  .bg-peach {
    background-color: hsl(var(--peach));
  }
  
  .bg-peach-dark {
    background-color: hsl(var(--peach-dark));
  }
  
  .bg-yellow-light {
    background-color: hsl(var(--yellow-light));
  }
  
  .bg-yellow {
    background-color: hsl(var(--yellow));
  }
  
  .bg-yellow-dark {
    background-color: hsl(var(--yellow-dark));
  }
  
  .text-brown {
    color: hsl(var(--brown));
  }
  
  .text-brown-light {
    color: hsl(var(--brown-light));
  }
  
  .border-peach {
    border-color: hsl(var(--peach));
  }
  
  .border-peach-light {
    border-color: hsl(var(--peach-light));
  }
  
  .border-yellow {
    border-color: hsl(var(--yellow));
  }
}
```

## 9. Build APK Script (build-android.sh)

```bash
#!/bin/bash

# Step 1: Build the web application
echo "Building web application..."
npm run build

# Step 2: Initialize Capacitor if not already done
if [ ! -d "android" ]; then
  echo "Initializing Capacitor..."
  npx cap init "Our Love" com.ourlove.app --web-dir dist
  
  echo "Adding Android platform..."
  npx cap add android
else
  echo "Android platform already initialized."
fi

# Step 3: Sync the web code to the Android project
echo "Syncing web code to Android project..."
npx cap sync

echo "Build process completed!"
echo "To generate the APK file, you need to open Android Studio with the command:"
echo "npx cap open android"
echo "Then in Android Studio, select Build > Build Bundle(s) / APK(s) > Build APK(s)"
```
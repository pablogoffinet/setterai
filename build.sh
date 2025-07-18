#!/bin/bash

echo "🚀 Building LinkedIn Prospector for production..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Node.js is installed
if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

# Check if npm is installed
if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js and npm are installed${NC}"

# Build Backend
echo -e "\n${YELLOW}📦 Building Backend...${NC}"
cd backend
if npm run build; then
    echo -e "${GREEN}✅ Backend built successfully${NC}"
else
    echo -e "${RED}❌ Backend build failed${NC}"
    exit 1
fi
cd ..

# Build AI Engine
echo -e "\n${YELLOW}🤖 Building AI Engine...${NC}"
cd ai-engine
if npm run build; then
    echo -e "${GREEN}✅ AI Engine built successfully${NC}"
else
    echo -e "${RED}❌ AI Engine build failed${NC}"
    exit 1
fi
cd ..

# Build Queue Service
echo -e "\n${YELLOW}📬 Building Queue Service...${NC}"
cd queue-service
if npm run build; then
    echo -e "${GREEN}✅ Queue Service built successfully${NC}"
else
    echo -e "${RED}❌ Queue Service build failed${NC}"
    exit 1
fi
cd ..

# Build Frontend
echo -e "\n${YELLOW}🎨 Building Frontend...${NC}"
cd frontend
if npm run build; then
    echo -e "${GREEN}✅ Frontend built successfully${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi
cd ..

echo -e "\n${GREEN}🎉 All services built successfully!${NC}"
echo -e "${YELLOW}📁 Compiled files are in the 'dist' folders${NC}"
echo -e "${YELLOW}🚀 Ready for deployment on Render!${NC}" 
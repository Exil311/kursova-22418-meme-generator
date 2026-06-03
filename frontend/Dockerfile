FROM node:22-alpine

WORKDIR /app

# Kopirame neshtata za failovete
COPY package*.json ./

# Slaame dependencies
RUN npm install

# Kopirame sichko ostanalo
COPY . .

# Tuka puskame porta
EXPOSE 3000

# Tuk puskame dev server-a na Vite
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]

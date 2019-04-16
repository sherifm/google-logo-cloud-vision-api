FROM node

# Create app directory
WORKDIR /app

COPY package.json /app

#copy authentication key_file
COPY google_logo_detection_auth_key.json /app

RUN npm install
RUN npm rebuild
COPY . .

#auth file
ENV GOOGLE_APPLICATION_CREDENTIALS google_logo_detection_auth_key.json
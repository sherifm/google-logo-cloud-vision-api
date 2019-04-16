FROM node

# Create app directory
WORKDIR /app

COPY package.json /app

#copy authentication key_file
COPY google_logo_detection_auth_key.json /app

RUN npm install
RUN npm rebuild
COPY . .

# RUN /bin/bash -c "curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-241.0.0-linux-x86_64.tar.gz"
# RUN /bin/bash -c "tar zxvf google-cloud-sdk-241.0.0-linux-x86_64.tar.gz google-cloud-sdk"

# RUN /bin/bash -c "bash ./google-cloud-sdk/install.sh"

# RUN /bin/bash -c "source ~/.bashrc"

#auth file
ENV GOOGLE_APPLICATION_CREDENTIALS google_logo_detection_auth_key.json
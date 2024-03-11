FROM mobiledevops/android-sdk-image

# Install system dependencies
USER root
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y curl git wget unzip \
    xz-utils zip libglu1-mesa openjdk-17-jdk-headless sudo libc6 libstdc++6

# Install Node.js
RUN sudo wget https://nodejs.org/dist/v20.10.0/node-v20.10.0-linux-x64.tar.xz && \
    sudo tar -xJf node-v20.10.0-linux-x64.tar.xz -C /usr/local --strip-components=1 && \
    rm node-v20.10.0-linux-x64.tar.xz && \
    sudo ln -s /usr/local/bin/node /usr/local/bin/nodejs

# Clean up APT
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Adds user mobiledevops to sudoers 
RUN mkdir -p /etc/sudoers.d && \
    echo "mobiledevops ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/mobiledevops && \
    chmod 0440 /etc/sudoers.d/mobiledevops

# Set the user and working directory
USER mobiledevops
WORKDIR /home/mobiledevops

# Copy package.json and package-lock.json
COPY package*.json .

# Install node dependencies
RUN sudo npm install && \
    sudo npm install -g react-native-cli

# Expose ports
EXPOSE 5037

# Copy source code
COPY . .

# Set permissions
RUN sudo chown -R mobiledevops:mobiledevops /home/mobiledevops

# Start emulator
#ENTRYPOINT ["sh", "./docker-entrypoint.sh"]

# Running container in interactive shell
#docker run -it --rm -p 5037:5037 react-native-environment
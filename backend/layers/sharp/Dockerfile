FROM amazonlinux:latest

ARG OUT=/root/layers
ARG NODE_VERSION=14

# set up container
RUN yum -y update
RUN yum -y install make gcc* zip
RUN curl --silent --location https://rpm.nodesource.com/setup_${NODE_VERSION}.x | bash -
RUN yum install -y nodejs


# will be created and become working dir
WORKDIR $OUT/nodejs

# install sharp
RUN npm init -y
RUN npm install --platform=linux --arch=x64 sharp


# comback to base
WORKDIR $OUT

ENTRYPOINT ["zip","-r","-9"]
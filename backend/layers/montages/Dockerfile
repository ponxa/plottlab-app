FROM amazonlinux:latest

ARG OUT=/root/layers/
ARG PYTHON_VERSION=3.8

# setup container
RUN yum -y update
RUN yum -y install gcc* zip 
RUN yum -y install python3-${PYTHON_VERSION} python3-pip

# setup workdir
WORKDIR $OUT/python
# install python packages
COPY ./requirements.txt .
RUN python3 -m pip install -r ./requirements.txt
RUN mkdir  lib
RUN cp -R /usr/local/lib64/python${PYTHON_VERSION} ./lib

WORKDIR $OUT

ENTRYPOINT ["zip","-r","-9"]
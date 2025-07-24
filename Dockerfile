FROM debian:bookworm
#FROM balenalib/aarch64-debian-node:20-latest
#balenalib/raspberry-pi-debian:latest

RUN apt-get update && apt-get -y upgrade && apt-get update
RUN apt-get -y install sudo dpkg-dev debhelper dh-virtualenv \
  python3 python3-venv python3-pip

RUN python3 -m pip install --upgrade pip
RUN apt-get -y install libxslt-dev libxml2-dev
RUN apt-get -y install build-essential libssl-dev libffi-dev python3-dev pkg-config
RUN apt-get -y install zlib1g-dev
RUN bash -c "curl https://sh.rustup.rs -sSf | sh -s -- -y"
ENV PATH="/root/.cargo/bin:${PATH}"
RUN bash -c "curl -sSL https://install.python-poetry.org | python3 -"

ENV PATH=$PATH:~/.local/bin \
  DEB_BUILD_ARCH=arm64 \
  DEB_BUILD_ARCH_BITS=64 \
  PIP_DEFAULT_TIMEOUT=600 \
  PIP_TIMEOUT=600 \
  PIP_RETRIES=100



RUN curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
RUN apt-get install -y nodejs
RUN npm install -g npm@11.4.2
RUN npm install -g yarn
COPY . /build/

WORKDIR /build
RUN /root/.local/bin/poetry build

WORKDIR /build/frontend
RUN npm i
RUN yarn build

WORKDIR /build/dist
RUN dpkg-buildpackage -us -uc

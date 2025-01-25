---
categories:
  - DevOps
date: 2025-01-24T15:09:28+09:00
draft: false
tags:
  - docker
title: "[Docker] Storage, Storage Driver"
---
## Docker File System

When Docker is installed, the following folders are created in the local environment to store containers, images, volumes, and more:

- `/var/lib/docker`
	- `aufs`
	- `containers`
	- `image`
	- `volumes`

> For macOS and Windows, Docker Desktop is used, and all Docker-related data is stored inside the LinuxKit VM. Therefore, these folders do not exist on those systems.

---

## Docker Volumes

In Docker, any files created or modified inside a container are lost when the container is removed. To retain data even after a container is gone, you can use a **Volume**.

### Volume Mounts

Running the following command creates a volume:

```bash
docker volume create data_volume 

# /var/lib/docker
# ├── volumes
# |   ├── data_volume
```

You can then mount this volume when running a container:

```bash
docker run -v data_volume:/var/lib/mysql mysql 
# docker run -v {volume_name}:{location_in_container} {image_name}
```

Even if the container is removed, the data remains intact in `data_volume`.

> If you don’t create a volume beforehand and directly mount it during container creation, Docker automatically creates the volume for you. 🙂

This approach is called **Volume Mounts**.

---

### Bind Mounts

Don’t want to store data in `/var/lib/docker`? 🤔

You can specify any directory on the host system instead of using a volume name:

```bash
docker run -v /data/loc:/var/lib/mysql mysql 
# docker run -v {host_path}:{location_in_container} {image_name}
```

This approach is referred to as **Bind Mounts**.

---

### tmpfs Mounts

This method doesn’t store data on the local disk or even inside the container. Instead, the data is stored in the host’s memory.

If the container stops or the host system restarts, the data is lost.  
Why use this, then? 🤔

It’s typically used for **temporary or in-memory storage**, like caching or storing credentials.

---

## COW (Copy On Write)

You might know about images and containers, but what is `aufs`? Let’s break it down.

Docker manages data using layers—**read-only images** and **writable container data**—in what’s called a **Layered Architecture**.

### How It Works

1. **Image Creation**
	- An image is composed of multiple layers stacked together (read-only).

2. **Container Creation**
	- When a container is started, Docker adds a writable layer on top of the image’s read-only layers.
	- All changes made inside the container (e.g., logs, new data) are saved in this writable layer.

   ![](Screenshot%202025-01-24%20at%204.18.17%20PM.png)

3. **File System Management**
	- **Reading files inside the container:** Data is read from the image layers.
	- **Modifying files inside the container:**
		- The **Copy-on-Write (CoW)** mechanism copies the file from the image layers to the writable layer before modifying it.
		- For example, if `app.py` is part of the image and you modify it, the original file in the image remains unchanged. Instead, the file is copied to the container layer and then modified.

> Thanks to Copy-on-Write, this layered structure is possible!

Does Docker handle all this? Not exactly. This is managed by the **Storage Driver**.

---

## Storage Driver

- Splits images into multiple read-only layers.
- Creates a new writable layer when a container is started.
- Implements the Copy-on-Write mechanism.
- Shares image layers across containers, minimizing disk usage when multiple containers are based on the same image.

The **Storage Driver** ensures Docker uses disk space efficiently. Different drivers are used based on the operating system:

- `aufs`
- `zfs`
- `btrfs`
- `Device Mapper`
- `overlay`
- `overlay2`








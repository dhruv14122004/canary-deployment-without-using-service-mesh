# 🚀 Canary Deployment in Kubernetes (Beginner-Friendly Project)

This project demonstrates a Canary Deployment in Kubernetes without using a service mesh.

A canary deployment lets you release a new version of your application to a small percentage of users before rolling it out to everyone.

## 📌 What is Canary Deployment?

A canary deployment is a rollout strategy where:

- Most users get the stable (old) version
- A few users get the new (canary) version

If everything works well → promote the canary
If something breaks → roll back quickly

## 🛠 Technologies Used

- Node.js (simple backend app)
- Docker (containerization)
- Minikube (local Kubernetes cluster)
- kubectl (Kubernetes CLI)
- YAML (Kubernetes manifests)

## 📁 Project Structure

Repository root:

- `app_v1.js`                  # Stable application (v1)
- `app_v2.js`                  # Canary application (v2)
- `Dockerfile-v1`              # Dockerfile for v1
- `Dockerfile-v2`              # Dockerfile for v2
- `deployment_v1.yaml`         # Stable Kubernetes deployment (v1)
- `deployment_v2.yaml`         # Canary Kubernetes deployment (v2)
- `services.yaml`              # Kubernetes Service
- `package.json`               # Node.js dependencies
- `README.md`                  # This file
- `screenshots/`               # Proof and screenshots (optional)

## ⚙️ Step 1 — Create Application Files

Version 1 (Stable) — `app_v1.js`

```js
const express = require('express')
const app = express()
app.get("/",(req,res)=>{
  res.send("It is the Stable Version")
})
app.listen(8080, ()=>console.log("Stable V1 is running"))
```

Version 2 (Canary) — `app_v2.js`

```js
const express = require('express')
const app = express()
app.get("/",(req,res)=>{
  res.send("It is the canary Version")
})
app.listen(8080, ()=> console.log("Canary V2 is running"))
```

## �� Step 2 — Dockerfiles

`Dockerfile-v1`

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY app_v1.js .
EXPOSE 8080
CMD ["node","app_v1.js"]
```

`Dockerfile-v2`

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY app_v2.js .
EXPOSE 8080
CMD ["node","app_v2.js"]
```

## 📦 Step 3 — Build & Push Docker Images

Run:

```bash
docker build -f Dockerfile-v1 -t <yourhub>/canary-app:v1 .
docker push <yourhub>/canary-app:v1

docker build -f Dockerfile-v2 -t <yourhub>/canary-app:v2 .
docker push <yourhub>/canary-app:v2
```

(Replace `<yourhub>` with your Docker Hub username or registry.)

## ☸️ Step 4 — Kubernetes Deployments

`deployment_v1.yaml` (Stable)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-v1
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: app
        image: <yourhub>/canary-app:v1
        ports:
        - containerPort: 8080
```

`deployment_v2.yaml` (Canary)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-v2
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: app
        image: <yourhub>/canary-app:v2
        ports:
        - containerPort: 8080
```

## 🌐 Step 5 — Kubernetes Service

`services.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  type: NodePort
  selector:
    app: myapp
  ports:
  - port: 80
    targetPort: 8080
    nodePort: 30080
```

## 🚀 Step 6 — Deploy to Kubernetes

```bash
kubectl apply -f deployment_v1.yaml
kubectl apply -f deployment_v2.yaml
kubectl apply -f services.yaml
```

Check pods:

```bash
kubectl get pods
```

You should see:

- 3 pods → v1 (stable)
- 1 pod → v2 (canary)

## 🌍 Step 7 — Access the Application

```bash
minikube service myapp-service --url
```

Open the generated URL in your browser. Refresh multiple times — you should mostly see the stable version and occasionally the canary.

## 🔄 Step 8 — Rollback Canary Version

If the canary has issues:

```bash
kubectl delete deployment app-v2
```

Now 100% of traffic goes to the stable version (v1).

## ⬆️ Step 9 — Promote Canary → Stable

If the canary is successful:

```bash
kubectl set image deployment/app-v1 app=<yourhub>/canary-app:v2
kubectl delete deployment app-v2
```

Now 100% of users receive version v2.

## 📸 Screenshots

Below are the screenshots (files under `screenshots/`). If you don't have them yet, add PNGs with these names and they will render.

<img src="Screenshots/1st.png" alt="Pods output" style="max-width:100%; height:auto; display:block; margin:auto;" />

*Output of* `kubectl get pods`

<img src="Screenshots/2nd.png" alt="Service describe" style="max-width:100%; height:auto; display:block; margin:auto;" />

*Output of* `kubectl describe svc myapp-service`

<img src="Screenshots/3rd.png" alt="Minikube URL output" style="max-width:100%; height:auto; display:block; margin:auto;" />


*Output of* `minikube service myapp-service --url`

<img src="Screenshots/4th.png" alt="Traffic test output" style="max-width:100%; height:auto; display:block; margin:auto;" />


*Output of* `while true; do curl <url>; echo; sleep 0.5; done`

<img src="Screenshots/5th.png" alt="Rollback output" style="max-width:100%; height:auto; display:block; margin:auto;" />


*Output of Rollback*

<img src="Screenshots/6th.png" alt="Promote output" style="max-width:100%; height:auto; display:block; margin:auto;" />


*Output of Promote*

<img src="Screenshots/7th.png" alt="Docker images pushed" style="max-width:100%; height:auto; display:block; margin:auto;" />

*Docker images pushed*

## 🎯 Conclusion

This project demonstrates:

- Canary deployment
- Traffic splitting without a service mesh
- Multi-version Kubernetes deployment
- Rollback and promotion strategies

## ✨ Author

Dhruv Sharma
B.Tech — JK Lakshmipat University

# rank-anything
Definitively Rank a list of items by completing comparisons


# Setup Instructions

This is an Angular application with separate client and server components written in typescript. The client is configured to route /api requests to the server (which helps reduce the CORS issues). It uses MongoDB which is deployed with the compose file.

## To setup the project

Install docker desktop on your system [link](https://www.docker.com/products/docker-desktop/). If it asks you to make an account there should be a button that allows you to skip. 

Clone the repo
```
git clone https://github.com/enabledornot/rank-anything
```

Copy the ```.env.example``` file to ```.env``` and set a password

Run the command below. Compose starts MongoDB with a persistent Docker-managed volume, waits for it to become healthy, and then starts both the client and server. MongoDB data uses a Docker-managed volume because MongoDB's WiredTiger storage cannot safely use a Windows host bind mount.
```
npm run dev
```

## Common Issues

Docker likes to fall asleep. Occasionally you can get some kind of connection refused error when starting the server. If that happens reopen docker desktop and ensure docker engine is started.

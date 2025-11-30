# Grab-a-Drink

**Grab-a-Drink** is a bar ordering system where the bar can:

* Log in and get authorized
* Track and receive orders
* View analytics for orders
* Manage the menu
* Manage tables
* Change credentials

## Running the Project

Make sure you have Docker and Docker Compose installed.

From the root of the project, run:

```bash
docker-compose up --build
```

This will build and start both the backend and frontend containers.

## Project Structure

```
main-folder/
│
├─ backend/      # Node.js + Express backend
├─ frontend/     # React/Next.js frontend
```

After running Docker, the backend and frontend will be accessible on their respective ports.

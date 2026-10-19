# Check local services before assuming they are unavailable

- Context: while testing the `pnpm bootstrap` installer (issue #6), `docker info` returned "permission denied" and port 5432 was already listening.
- Cause: the agent concluded that Docker was unusable and that port 5432 belonged to an unrelated service, and planned validation around both assumptions. The port was this project's own Compose PostgreSQL (credentials from `.env.example`), and the user could reach Docker through its `docker` group in a new group session.
- Resolution: the owner corrected both points. The installer now checks the database at `DATABASE_URL` first and starts Compose only when it does not respond, and all three live scenarios ran against real PostgreSQL.
- Verification: `docker ps` with Docker group access showed the project's container, its Compose working directory and no other client connections before it was stopped for a test and restarted afterwards.
- Prevention (proposal, not a standing rule): before declaring a local service unavailable or foreign, check Docker group access and the Compose project that owns the port (`docker ps`, Compose project labels), and ask the owner if it is still unclear.

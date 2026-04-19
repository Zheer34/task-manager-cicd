const request = require("supertest");
const app = require("../app");

describe("Task Manager API", () => {
	test("GET / should return HTML page", async () => {
		const res = await request(app).get("/");
		expect(res.statusCode).toBe(200);
		expect(res.text).toContain("<title>Task Manager</title>");
	});

	test("GET /health should return status ok", async () => {
		const res = await request(app).get("/health");
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ status: "ok" });
	});

	test("GET /tasks should return tasks array", async () => {
		const res = await request(app).get("/tasks");
		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
	});

	test("POST /tasks should create a new task", async () => {
		const res = await request(app)
			.post("/tasks")
			.send({ title: "Write Jenkinsfile", completed: false });

		expect(res.statusCode).toBe(201);
		expect(res.body.title).toBe("Write Jenkinsfile");
		expect(res.body.completed).toBe(false);
	});

	test("POST /tasks should fail without title", async () => {
		const res = await request(app).post("/tasks").send({ completed: false });

		expect(res.statusCode).toBe(400);
		expect(res.body.error).toBe("Title is required");
	});

	test("DELETE /tasks/:id should delete a task", async () => {
		const createRes = await request(app)
			.post("/tasks")
			.send({ title: "Delete this task", completed: false });

		const deleteRes = await request(app).delete(`/tasks/${createRes.body.id}`);
		expect(deleteRes.statusCode).toBe(200);
		expect(deleteRes.body.title).toBe("Delete this task");
	});
});

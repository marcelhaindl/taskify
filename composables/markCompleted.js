// Functino to mark task as completed
export default async function (markCompleted, id) {
    return await $fetch(`/api/tasks/markCompleted/${id}`, {
        method: "put",
        body: { completed: markCompleted },
    });
}
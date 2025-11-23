var user1 = {
    id: 1,
    username: "john_doe",
    email: "john_doe@example.com",
    avatar: "avatar1.png"
};
var post1 = {
    id: 1,
    title: "My First Post",
    content: "This is the content of my first post.",
    autor: user1,
    autorId: user1.id,
    createdAt: new Date(),
    tegs: ["introduction", "firstpost"]
};
var comment1 = {
    id: 1,
    postId: post1.id,
    autor: user1,
    autorId: user1.id,
    content: "Great post! Looking forward to more.",
    createdAt: new Date()
};
function handleResponse(res) {
    switch (res.status) {
        case "loading":
            console.log("Loading...");
            break;
        case "success":
            // TypeScript knows res is ApiSuccess<T> here
            console.log("Success:", res.data);
            break;
        case "error":
            // res is ApiError here
            console.error("Error ".concat(res.code, ": ").concat(res.message));
            break;
        default:
            // Exhaustiveness check
            var _exhaustive = res;
            return _exhaustive;
    }
}
// Примеры использования
var loading = { status: "loading" };
var success = { status: "success", data: post1 };
var error = { status: "error", message: "Not found", code: 404 };
handleResponse(loading);
handleResponse(success);
handleResponse(error);

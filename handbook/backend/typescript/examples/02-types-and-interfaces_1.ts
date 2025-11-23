// User, Post и Comment interfaces
interface user {
    id: number;
    username: string;
    email: string;
    avatar?: string;
}

interface post {
    id: number;
    title: string;
    content: string;
    autor: user;
    autorId: number;
    createdAt: Date;
    tegs?: string[];
}

interface comment {
    id: number;
    postId: number;
    autor: user;
    autorId: number;
    content: string;
    createdAt: Date;
}

const user1: user = {
    id: 1,
    username: "john_doe",
    email: "john_doe@example.com",
    avatar: "avatar1.png"
};

const post1: post = {
    id: 1,
    title: "My First Post",
    content: "This is the content of my first post.",
    autor: user1,
    autorId: user1.id,
    createdAt: new Date(),
    tegs: ["introduction", "firstpost"]
};

const comment1: comment = {
    id: 1,
    postId: post1.id,
    autor: user1,
    autorId: user1.id,
    content: "Great post! Looking forward to more.",
    createdAt: new Date()
};

// TODO: Discriminated union for API responses and handler
// 1. Создайте Discriminated Union для ApiResponse:
//    - Success: { status: "success"; data: T }
//    - Error: { status: "error"; message: string; code: number }
//    - Loading: { status: "loading" }
// 2. Создайте функцию handleResponse, которая обрабатывает каждый случай

type ApiSuccess<T> = { status: "success"; data: T };
type ApiError = { status: "error"; message: string; code: number };
type ApiLoading = { status: "loading" };

type ApiResponse<T> = ApiSuccess<T> | ApiError | ApiLoading;

function handleResponse<T>(res: ApiResponse<T>): void {
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
            console.error(`Error ${res.code}: ${res.message}`);
            break;
        default:
            // Exhaustiveness check
            const _exhaustive: never = res;
            return _exhaustive;
    }
}

// Примеры использования
const loading: ApiResponse<post> = { status: "loading" };
const success: ApiResponse<post> = { status: "success", data: post1 };
const error: ApiResponse<post> = { status: "error", message: "Not found", code: 404 };

handleResponse(loading);
handleResponse(success);
handleResponse(error);


import { API, normalizeList, apiError, getTodos, deleteTodo } from "../api";

jest.mock("axios", () => ({
  create: jest.fn(() => ({
    get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn(),
    interceptors: { request: { use: jest.fn() } },
  })),
}));

test("normalise plusieurs formats de listes", () => {
  expect(normalizeList([1, 2])).toEqual([1, 2]);
  expect(normalizeList({ data: { data: [1] } })).toEqual([1]);
  expect(normalizeList({ items: [2] })).toEqual([2]);
  expect(normalizeList({ results: [3] })).toEqual([3]);
  expect(normalizeList(null)).toEqual([]);
});

test("formate les erreurs API", () => {
  expect(apiError({ response: { data: { message: "Erreur serveur" } } })).toBe("Erreur serveur");
  expect(apiError({ response: { data: { errors: { email: ["Email invalide"] } } } })).toBe("Email invalide");
  expect(apiError(new Error("Network"))).toBe("Network");
});

test("les fonctions API construisent les appels attendus", () => {
  API.get.mockClear(); API.delete.mockClear();
  getTodos({ status: "done" });
  deleteTodo(5);
  expect(API.get).toHaveBeenCalledWith("/todos", { params: { status: "done" } });
  expect(API.delete).toHaveBeenCalledWith("/todos/5");
});

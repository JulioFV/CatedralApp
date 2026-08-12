import { LoginData } from "./types/auth";

let idUsuario: number | null = null;
let nombre = "";
let app = "";
let email = "";
let password = "";
let id_rol: number | null = null;

export const setIdUsuario = (id: number | null): void => {
  idUsuario = id;
};
export const getIdUsuario = (): number | null => idUsuario;

export const setNombre = (nom: string): void => {
  nombre = nom;
};
export const getNombre = (): string => nombre;

export const setApp = (apps: string): void => {
  app = apps;
};
export const getApp = (): string => app;

export const setEmail = (em: string): void => {
  email = em;
};
export const getEmail = (): string => email;

export const setPassword = (pass: string): void => {
  password = pass;
};
export const getPassword = (): string => password;

export const setIdRol = (idRol: number | null): void => {
  id_rol = idRol;
};
export const getIdRol = (): number | null => id_rol;

export const setSession = (data: LoginData): void => {
  setIdUsuario(data.id_usuario);
  setNombre(data.nombre);
  setApp(data.app);
  setEmail(data.email);
  setPassword(data.password);
  setIdRol(data.id_rol);
};

export const clearSession = (): void => {
  setIdUsuario(null);
  setNombre("");
  setApp("");
  setEmail("");
  setPassword("");
  setIdRol(null);
};
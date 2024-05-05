import { SignUpFormData } from "./components/auth-ui/SignUpForm";
import { SignInFormData } from "./components/auth-ui/SignInForm";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const login = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  })

  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(responseBody.message)
  }

  return responseBody;
}

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: 'include',
  })

  if(!response.ok) {
    throw new Error("Token invalid")
  }

  return response.json();
}

export const logout = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    credentials: "include",
    method: "POST",
  })

  if(!response.ok) {
    throw new Error("Error during sign out")
  }
}

export const register = async (formData: SignUpFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData),
  })

  const responseBody = await response.json();

  if(!response.ok) {
    throw new Error(responseBody.message)
  }
}
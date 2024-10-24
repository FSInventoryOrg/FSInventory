const { ROCKS_DEV_API_URL } = process.env;

const tokenStatus = async (token: string) => {
  const status = await fetch(`${ROCKS_DEV_API_URL}/auth/check`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });

  if(!status.ok) throw Error("Token expired")

  return status;
}


export { tokenStatus };
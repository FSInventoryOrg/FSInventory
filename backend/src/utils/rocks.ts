const { ROCKS_DEV_API_URL, ROCKS_PRODUCTION_API_URL, NODE_ENV } = process.env;

const API_URL: string = NODE_ENV
  ? ROCKS_PRODUCTION_API_URL!
  : ROCKS_DEV_API_URL!;

const tokenStatus = async (token: string) => {
  const status = await fetch(`${API_URL}/auth/check`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!status.ok) throw Error("Token expired");

  return status;
};

export { tokenStatus };

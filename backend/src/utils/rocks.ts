const { ROCKS_DEV_API_URL } = process.env;

const tokenStatus = async (token: string) => {
  try {
    const status = await fetch(`${ROCKS_DEV_API_URL}/auth/check`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    console.log(status);

    if(!status.ok) throw Error("Token expired")

    return status;
  } catch (err) {
    throw err;
  }
}


export { tokenStatus };
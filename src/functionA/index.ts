export const GET = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({message: "GET functionA"}),
  };
};

export const POST = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({message: "GET functionA"}),
  };
};

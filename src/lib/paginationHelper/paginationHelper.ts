export const paginationHelper = (url: string) => {
  const { searchParams } = new URL(url);
  const limit = Number(searchParams.get("limit")) || 12;
  const page = Number(searchParams.get("page")) || 1;

  return {
    limit,
    page,
    skip: (page - 1) * limit,
  };
};

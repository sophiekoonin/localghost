const collectionId = process.env.RAINDROP_BLOGROLL_COLLECTION_ID;
const token = process.env.RAINDROP_TOKEN;

async function fetchLinks() {
  let fetchedAll = false;
  let raindrops = [];
  let page = 0;
  const url = new URL(`https://api.raindrop.io/rest/v1/raindrops/${collectionId}`);

  while (!fetchedAll) {
    const rsp = await (
      await fetch(`${url}?page=${page}&sort=title`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ).json();

    if (rsp.items == null) {
      fetchedAll = true;
      return;
    }

    raindrops = raindrops.concat(
      rsp.items.map((raindrop) => {
        const { link, title, excerpt, note, tags } = raindrop;

        const description = note === "" ? excerpt : note;
        return { link, title, description, tags };
      }),
    );

    if (raindrops.length >= rsp.count) {
      fetchedAll = true;
    } else {
      page++;
    }
  }
  return raindrops.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.tags[0]]: [...(acc[curr.tags[0]] ?? []), curr],
    };
  }, {});
}

export default {
  eleventyComputed: {
    links: async (data) => await fetchLinks(),
    blogroll: (data) => (typeof data.links === "object" ? data.links.blogroll : []),
    useful: (data) => (typeof data.links === "object" ? data.links.useful : []),
    delightful: (data) => (typeof data.links === "object" ? data.links.delightful : []),
  },
};

const fetch = require("node-fetch");
const { format, subDays } = require("date-fns");
const fs = require("fs");

const collectionId = process.env.RAINDROP_COLLECTION_ID;
const token = process.env.RAINDROP_TOKEN;
const today = new Date();
const lastSaturday = subDays(today, 8);
const formattedLastSaturday = format(lastSaturday, "yyyy-MM-dd");
const formattedToday = format(today, "yyyy-MM-dd");

async function fetchLinks() {
  // Get content bookmarked between last Sunday and this Saturday inclusive
  const search = new URLSearchParams({
    search: `created:>${formattedLastSaturday} created:<${formattedToday}`,
  });
  const url = new URL(`https://api.raindrop.io/rest/v1/raindrops/${collectionId}`);
  url.search = search;
  const rsp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await rsp.json();
}

function writePost(raindrops) {
  const formattedLinks = raindrops.map((raindrop) => {
    const { link, title, excerpt, note } = raindrop;

    const description = note === "" ? excerpt : note;
    return `* [${title}](${link}) - ${description}`;
  });

  let postContent = fs.readFileSync("./scripts/link_template.md", "utf8");
  postContent = postContent.replace("{{date}}", formattedToday);
  postContent = postContent.replace("{{links}}", formattedLinks.join("\n"));
  fs.writeFileSync(`./src/blog/links/${formattedToday}.md`, postContent);
}

async function main() {
  fetchLinks().then((res) => {
    if (res.items.length === 0) {
      console.log("No links found, exiting");
      return;
    }
    writePost(res.items);
  });
}

main();

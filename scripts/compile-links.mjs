import { format, subDays, addHours } from "date-fns";
import fs from "fs";

const collectionId = process.env.RAINDROP_COLLECTION_ID;
const token = process.env.RAINDROP_TOKEN;
const today = Temporal.Now.plainDateTimeISO().with({
  hour: 9,
  minutes: 59,
  seconds: 59,
  milliseconds: 59,
});

const lastSunday = today.subtract("P7D").with({
  hour: 10,
  minutes: 0,
  seconds: 0,
  milliseconds: 0,
});

const formattedLastSunday = lastSunday.toPlainDate().toString();
const formattedToday = today.toPlainDate().toString();

console.log(formattedLastSunday, formattedToday);
async function fetchLinks() {
  // Get content bookmarked between last Sunday and this Saturday inclusive
  const search = new URLSearchParams({
    search: `created:>${formattedLastSunday} created:<${formattedToday}`,
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
  const filename = `./src/blog/links/${formattedToday}.md`;
  if (process.env.DEBUG) {
    console.log(postContent);
    return;
  }
  fs.writeFileSync(`./src/blog/links/${formattedToday}.md`, postContent);
}

async function main() {
  fetchLinks().then((res) => {
    debugger;
    if (res.items.length === 0) {
      console.log("No links found, exiting");
      return;
    }
    writePost(res.items);
  });
}

main();

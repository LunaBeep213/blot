import { i as createVNode, s as spreadAttributes, F as Fragment } from "./astro.2c740cbe.mjs";
import "html-escaper";
import "cookie";
import "kleur/colors";
import "path-to-regexp";
import "mime";
import "string-width";
const images = {};
function updateImageReferences(html2) {
  return html2.replaceAll(
    /__ASTRO_IMAGE_="([^"]+)"/gm,
    (full, imagePath) => spreadAttributes({ src: images[imagePath].src, ...images[imagePath].attributes })
  );
}
const html = updateImageReferences('<h2 id="beginner-25min">Beginner, 25min</h2>\n<p><em>This tutorial is aimed at beginners, but it works best if you have a little prior programming experience.</em></p>\n<p>“10PRINT” is one of the oldest and most well-known examples of generative art. It was originally created for the Commodore 64 in BASIC, and the code looked like this:\n<code>10 PRINT CHR$(205.5+RND(1)); : GOTO 10</code>\nFrom just that one line, the following intricate pattern is created:</p>\n<img src="https://elmcip.net/sites/default/files/media/work/images/the_ppg256_article_image.png" width="512">\n<p>There’s even a book named after this program: <a href="https://10print.org/">10print.org</a>! For this guide, let’s try to replicate this artwork for <strong><em>Haxidraw</em></strong>. (This tutorial works fine if you don’t have one!)</p>\n<p>A Haxidraw is a small drawing robot that can be programed from a browser. You send it instructions through code, and it follows those instructions to create a drawing. By the end of this guide, you will have created some art that can be drawn by the machine!</p>\n<img src="https://haxidraw.hackclub.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fdrawing-machine.726ff526.png&#x26;w=3840&#x26;q=75" width="512">\n<img src="https://cloud-gal4nsl32-hack-club-bot.vercel.app/0image.png" width="512">\n<p>Here are some examples of art people have made with Haxidraw:</p>\n<img src="https://github.com/hackclub/haxidraw/blob/main/art/landscape-henry/snapshots/landscape.png?raw=true" width="512">\n<img src="https://github.com/hackclub/haxidraw/blob/main/art/roots-kai/snapshots/roots.png?raw=true" width="512">\n<img src="https://github.com/hackclub/haxidraw/blob/main/art/tidal-flats-leo/snapshots/tidalFlats.png?raw=true" width="512">\n<p>Now, let’s take another look at the original 10PRINT artwork that we’ll try to replicate.</p>\n<img src="https://elmcip.net/sites/default/files/media/work/images/the_ppg256_article_image.png" width="512">\n<p>The artwork seems to be a grid of slashes. Some slashes point to to the top-right, others point to the bottom-right. Overall, the distribution seems to be about 50/50. If you look closely, you might notice that the slashes are just plain text: ”/” or ”\\“. In fact, the Commodore program just prints a random sequence of characters to the screen, left to right. The challenge is, in the Haxidraw editor, you can’t write symbols directly to the screen - we’ll have to draw the slashes as lines.</p>\n<p>On a high level, here’s our strategy:</p>\n<ul>\n<li>Like a typewriter, move horizontally, drawing a forwards or backwards slash at each square randomly. Once we hit the end of a row, return to the start.</li>\n</ul>\n<p>This looks like:</p>\n<img src="https://cloud-eeo1n3h1p-hack-club-bot.vercel.app/0image.png" width="512">\n<p>So, let’s start making something! Boot up the editor at <a href="https://editor.haxidraw.hackclub.com/">editor.haxidraw.hackclub.com</a>. On the left side of the screen, you write code. On the other side, you can see a preview of what you’re building. At any point, press ”<strong>Run Code</strong>” at the top to see what you’ve made so far.</p>\n<p>Let’s start by defining a constant <code>t</code>: this will represent our turtle. The turtle is basically our pen - we can send it instructions like <code>t.up()</code> or <code>t.goto([x,y])</code> to move it around. For example, calling <code>t.down()</code> places the pen on the paper, and <code>t.goto([0, 0])</code> moves the pen to the position <code>0, 0</code>.</p>\n<pre class="language-plaintext"><code is:raw="" class="language-plaintext">const t = new Turtle();</code></pre>\n<p>Directly below that, write <code>drawTurtles(t);</code>. This function makes it so that we can see the turtle’s path in the preview window as we add to it.</p>\n<p>Now, we can declare two more constants, to represent the size and spacing of our grid. It’ll be useful to have these things as constants, because then we can easily change them later in the code to tweak the final image. The <code>gridSpacing</code> constant just dictates how far apart each slash of our drawing should be. A lower <code>gridSpacing</code> value means the pattern is more detailed, but you can change this value to whatever you want. The <code>gridSize</code> represents how large the final image should be.</p>\n<pre class="language-plaintext"><code is:raw="" class="language-plaintext">const gridSize = 10;\nconst gridSpacing = 0.5;</code></pre>\n<p>Now, we can get to building up the artwork. To be able to draw each line, we can create a <code>draw</code> function. This is a block of code that takes in 4 parameters: The x and y position to draw to, along with the width and height of the slash we’re going to draw.</p>\n<pre class="language-plaintext"><code is:raw="" class="language-plaintext">function draw(x, y, width, height) {</code></pre>\n<p>First, randomly choose whether to draw a forwards or backwards slash. This can be done in code by calling <code>rand()</code> - a function that returns a random number between 0 and 1. If it’s greater than 0.5, (this will be true 50% of the time), we draw a backslash.</p>\n<pre class="language-plaintext"><code is:raw="" class="language-plaintext">  if(Math.random() >= 0.5) {</code></pre>\n<p>To actually draw the slash, we need to give the turtle a few instructions. Start by raising the pen with <code>t.up()</code>, then go to our start position at <code>x, y</code>. Lower the pen, and move to the bottom-right a little bit, by adding <code>width</code> and <code>height</code> to the turtle position.</p>\n<pre class="language-plaintext"><code is:raw="" class="language-plaintext">    t.up();\n    t.goto([x, y]);\n    t.down();\n    t.goto([x + width, y + height]);</code></pre>\n<p>If the random number was instead below 0.5, then we can draw a forward slash. This is done in an <code>else</code> statement:</p>\n<pre class="language-plaintext"><code is:raw="" class="language-plaintext">  } else {</code></pre>\n<p>Raise the pen, but this time, start out a bit to the right of <code>x, y</code>. Lower the pen, and then move down by <code>height</code> from <code>x, y</code>. That’s a forward slash!</p>\n<pre class="language-plaintext"><code is:raw="" class="language-plaintext">    t.up();\n    t.goto([x + width, y]);\n    t.down();\n    t.goto([x, y + height]);\n  }\n}</code></pre>\n<p>Visually, this looks like:</p>\n<img src="https://cloud-3xbhxnc09-hack-club-bot.vercel.app/0image.png" width="512">\n<p>We’ve finished the drawing function, but we still need to call it. To run some code repeatedly, we use a <code>for</code> loop. We move across each row, left to right. At each grid cell, we call the <code>draw</code> function to draw the random slash. Once we hit the end of a row, we return to the start.</p>\n<p>If you need a refresher on how for loops work, the syntax is like this:</p>\n<pre class="language-plaintext"><code is:raw="" class="language-plaintext">for (code to run at the start of the loop;\n	keep looping as long as this code is true;\n	do this every loop) {\n	run this code every loop;\n}</code></pre>\n<p>We’ll want to loop through every row in the grid. By setting <code>y</code> to negative <code>gridSize</code>, we effectively shift the whole image down the screen. We do this to ensure that it’s within range for the Haxidraw to draw. To move to the next row, we add <code>gridSpacing</code> to <code>y</code> every time we loop. We only break once <code>y</code> reaches zero, because that means it’s traveled a total distance of <code>gridSize</code>, and we’ve drawn the image.</p>\n<pre class="language-plaintext"><code is:raw="" class="language-plaintext">for (let y = -gridSize; y &#x3C; 0; y += gridSpacing) {</code></pre>\n<p>Each time we’re at a new row, start moving horizontally by increasing <code>x</code>. At every <code>x</code> position draw a slash there by calling our <code>draw</code> function at that point.</p>\n<pre class="language-plaintext"><code is:raw="" class="language-plaintext">  for (let x = 0; x &#x3C; gridSize; x += gridSpacing) {\n    draw(x, y, gridSpacing, gridSpacing);\n  }\n}</code></pre>\n<p>And, lastly, let’s draw this to the screen! This is done simply by calling the function <code>drawTurtles</code> with the turtle we defined at the start.</p>\n<p><code>drawTurtles(t);</code></p>\n<p>And, you’re done! If all went well, you should be seeing something like the below art:</p>\n<img src="https://cloud-e0wpk8chk-hack-club-bot.vercel.app/0image.png" width="512">\n<p>Great job! You can still go farther with this, if you want.</p>\n<ul>\n<li>See what happens if you change the probability in our <code>draw</code> function from <code>0.5</code> to something else</li>\n<li>Try changing how detailed the artwork is, by tweaking <code>gridSpacing</code></li>\n<li>See what other patterns emerge when you draw things other than slashes</li>\n</ul>\n<p>Also - if you have a Haxidraw on hand, go through <a href="https://haxidraw.hackclub.com/">this guide</a> for instructions on how to set it up. After that, press “run machine”, and watch the Haxidraw draw the art you created!</p>');
const frontmatter = { "title": "10PRINT", "thumbnail": "https://elmcip.net/sites/default/files/media/work/images/the_ppg256_article_image.png", "contributors": "henrybass" };
const file = "/Users/jchen/Documents/Programming/haxidraw/new/guides/10PRINT.md";
const url = void 0;
function rawContent() {
  return '\n## Beginner, 25min\n\n_This tutorial is aimed at beginners, but it works best if you have a little prior programming experience._\n\n"10PRINT" is one of the oldest and most well-known examples of generative art. It was originally created for the Commodore 64 in BASIC, and the code looked like this:\n`10 PRINT CHR$(205.5+RND(1)); : GOTO 10`\nFrom just that one line, the following intricate pattern is created:\n\n<img src="https://elmcip.net/sites/default/files/media/work/images/the_ppg256_article_image.png" width="512"/>\n\nThere\'s even a book named after this program: [10print.org](https://10print.org/)! For this guide, let\'s try to replicate this artwork for **_Haxidraw_**. (This tutorial works fine if you don\'t have one!)\n\nA Haxidraw is a small drawing robot that can be programed from a browser. You send it instructions through code, and it follows those instructions to create a drawing. By the end of this guide, you will have created some art that can be drawn by the machine!\n\n<img src="https://haxidraw.hackclub.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fdrawing-machine.726ff526.png&w=3840&q=75" width="512"/>\n\n<img src="https://cloud-gal4nsl32-hack-club-bot.vercel.app/0image.png" width="512"/>\n\nHere are some examples of art people have made with Haxidraw:\n\n<img src="https://github.com/hackclub/haxidraw/blob/main/art/landscape-henry/snapshots/landscape.png?raw=true" width="512"/>\n\n<img src="https://github.com/hackclub/haxidraw/blob/main/art/roots-kai/snapshots/roots.png?raw=true" width="512"/>\n\n<img src="https://github.com/hackclub/haxidraw/blob/main/art/tidal-flats-leo/snapshots/tidalFlats.png?raw=true" width="512"/>\n\nNow, let\'s take another look at the original 10PRINT artwork that we\'ll try to replicate.\n\n<img src="https://elmcip.net/sites/default/files/media/work/images/the_ppg256_article_image.png" width="512"/>\n\nThe artwork seems to be a grid of slashes. Some slashes point to to the top-right, others point to the bottom-right. Overall, the distribution seems to be about 50/50. If you look closely, you might notice that the slashes are just plain text: "/" or "\\\\". In fact, the Commodore program just prints a random sequence of characters to the screen, left to right. The challenge is, in the Haxidraw editor, you can\'t write symbols directly to the screen - we\'ll have to draw the slashes as lines.\n\nOn a high level, here\'s our strategy:\n\n- Like a typewriter, move horizontally, drawing a forwards or backwards slash at each square randomly. Once we hit the end of a row, return to the start.\n\nThis looks like:\n\n<img src="https://cloud-eeo1n3h1p-hack-club-bot.vercel.app/0image.png" width="512"/>\n\nSo, let\'s start making something! Boot up the editor at [editor.haxidraw.hackclub.com](https://editor.haxidraw.hackclub.com/). On the left side of the screen, you write code. On the other side, you can see a preview of what you\'re building. At any point, press "**Run Code**" at the top to see what you\'ve made so far.\n\nLet\'s start by defining a constant `t`: this will represent our turtle. The turtle is basically our pen - we can send it instructions like `t.up()` or `t.goto([x,y])` to move it around. For example, calling `t.down()` places the pen on the paper, and `t.goto([0, 0])` moves the pen to the position `0, 0`.\n\n```\nconst t = new Turtle();\n```\n\nDirectly below that, write `drawTurtles(t);`. This function makes it so that we can see the turtle\'s path in the preview window as we add to it.\n\nNow, we can declare two more constants, to represent the size and spacing of our grid. It\'ll be useful to have these things as constants, because then we can easily change them later in the code to tweak the final image. The `gridSpacing` constant just dictates how far apart each slash of our drawing should be. A lower `gridSpacing` value means the pattern is more detailed, but you can change this value to whatever you want. The `gridSize` represents how large the final image should be.\n\n```\nconst gridSize = 10;\nconst gridSpacing = 0.5;\n```\n\nNow, we can get to building up the artwork. To be able to draw each line, we can create a `draw` function. This is a block of code that takes in 4 parameters: The x and y position to draw to, along with the width and height of the slash we\'re going to draw.\n\n```\nfunction draw(x, y, width, height) {\n```\n\nFirst, randomly choose whether to draw a forwards or backwards slash. This can be done in code by calling `rand()` - a function that returns a random number between 0 and 1. If it\'s greater than 0.5, (this will be true 50% of the time), we draw a backslash.\n\n```\n  if(Math.random() >= 0.5) {\n```\n\nTo actually draw the slash, we need to give the turtle a few instructions. Start by raising the pen with `t.up()`, then go to our start position at `x, y`. Lower the pen, and move to the bottom-right a little bit, by adding `width` and `height` to the turtle position.\n\n```\n    t.up();\n    t.goto([x, y]);\n    t.down();\n    t.goto([x + width, y + height]);\n```\n\nIf the random number was instead below 0.5, then we can draw a forward slash. This is done in an `else` statement:\n\n```\n  } else {\n```\n\nRaise the pen, but this time, start out a bit to the right of `x, y`. Lower the pen, and then move down by `height` from `x, y`. That\'s a forward slash!\n\n```\n    t.up();\n    t.goto([x + width, y]);\n    t.down();\n    t.goto([x, y + height]);\n  }\n}\n```\n\nVisually, this looks like:\n\n<img src="https://cloud-3xbhxnc09-hack-club-bot.vercel.app/0image.png" width="512"/>\n\nWe\'ve finished the drawing function, but we still need to call it. To run some code repeatedly, we use a `for` loop. We move across each row, left to right. At each grid cell, we call the `draw` function to draw the random slash. Once we hit the end of a row, we return to the start.\n\nIf you need a refresher on how for loops work, the syntax is like this:\n\n```\nfor (code to run at the start of the loop;\n	keep looping as long as this code is true;\n	do this every loop) {\n	run this code every loop;\n}\n```\n\nWe\'ll want to loop through every row in the grid. By setting `y` to negative `gridSize`, we effectively shift the whole image down the screen. We do this to ensure that it\'s within range for the Haxidraw to draw. To move to the next row, we add `gridSpacing` to `y` every time we loop. We only break once `y` reaches zero, because that means it\'s traveled a total distance of `gridSize`, and we\'ve drawn the image.\n\n```\nfor (let y = -gridSize; y < 0; y += gridSpacing) {\n```\n\nEach time we\'re at a new row, start moving horizontally by increasing `x`. At every `x` position draw a slash there by calling our `draw` function at that point.\n\n```\n  for (let x = 0; x < gridSize; x += gridSpacing) {\n    draw(x, y, gridSpacing, gridSpacing);\n  }\n}\n```\n\nAnd, lastly, let\'s draw this to the screen! This is done simply by calling the function `drawTurtles` with the turtle we defined at the start.\n\n`drawTurtles(t);`\n\nAnd, you\'re done! If all went well, you should be seeing something like the below art:\n\n<img src="https://cloud-e0wpk8chk-hack-club-bot.vercel.app/0image.png" width="512"/>\n\nGreat job! You can still go farther with this, if you want.\n\n- See what happens if you change the probability in our `draw` function from `0.5` to something else\n- Try changing how detailed the artwork is, by tweaking `gridSpacing`\n- See what other patterns emerge when you draw things other than slashes\n\nAlso - if you have a Haxidraw on hand, go through [this guide](https://haxidraw.hackclub.com/) for instructions on how to set it up. After that, press "run machine", and watch the Haxidraw draw the art you created!\n';
}
function compiledContent() {
  return html;
}
function getHeadings() {
  return [{ "depth": 2, "slug": "beginner-25min", "text": "Beginner, 25min" }];
}
async function Content() {
  const { layout, ...content } = frontmatter;
  content.file = file;
  content.url = url;
  const contentFragment = createVNode(Fragment, { "set:html": html });
  return contentFragment;
}
Content[Symbol.for("astro.needsHeadRendering")] = true;
export {
  Content,
  compiledContent,
  Content as default,
  file,
  frontmatter,
  getHeadings,
  images,
  rawContent,
  url
};

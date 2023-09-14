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
const html = updateImageReferences(`<h3 id="intermediate-45-min-by-henry-bass">(Intermediate, ~45 min, by Henry Bass)</h3>
<img src="https://cloud-gfjjr08b1-hack-club-bot.vercel.app/0image.png" width="512">
<p>This is an explainer on how to create art like the image above in the <a href="https://haxidraw.hackclub.dev/">Haxidraw editor</a>. It assumes some knowledge of programming in JavaScript and how Haxidraw works, but nothing beyond that.</p>
<h4 id="steps">Steps:</h4>
<ul>
<li>Create a height-map</li>
<li>Draw it</li>
<li>Add occlusion</li>
<li>Make it look nice</li>
</ul>
<h2 id="creating-a-height-map">Creating a height-map</h2>
<p>To try and create realistic terrain, we should first look at the real thing. Here’s a map of some hills in Canada:</p>
<img src="https://cloud-g5b83d93q-hack-club-bot.vercel.app/0image.png" width="512">
Notice that, although the terrain is complex, it looks somewhat random. There's also seemingly random detail at both large and small scales, from massive hills to small bumps.
<p>To replicate this in code, a technique is used called Fractal Noise. A reasonable first step would be to start out with pure randomness.</p>
<p>Here’s an image made up of large pixels of completely random brightness:</p>
<img src="https://cloud-fgexi20ng-hack-club-bot.vercel.app/0test.png" width="512">
<p>Real terrain, of course, isn’t made up of large squares. To get closer to the real thing, we can blur this image to make it smoother.</p>
<img src="https://cloud-i3ygpagk6-hack-club-bot.vercel.app/0test1.png" width="512">
<p>This is much closer, but it’s missing an essential aspect: Detail. Hills on a large scale resemble our image, but that resemblance breaks when we look closer. Conveniently though, the detail at both large and small scales looks pretty similar. So to capture this, we can try adding together our random noise on different scales. Each time, we decrease the amplitude of the noise and the blur radius (“Sigma”), while increasing the frequency.</p>
<img src="https://cloud-oidzg4hcv-hack-club-bot.vercel.app/0untitled_drawing__5_.png" width="512">
<p>That looks a lot closer! As a note, the amount we change the frequency, amplitude, and blur with respect to each octave is arbitrary, and tweaking those functions can lead to interesting variations of our noise. The name of this technique is: <em>Fractal Noise</em>.</p>
<p>In fact, the Haxidraw editor actually has a function for fractal noise built in!</p>
<pre class="language-js"><code is:raw="" class="language-js"><span class="token comment">// y and z are optional</span>
<span class="token function">noise</span><span class="token punctuation">(</span>
  <span class="token punctuation">[</span>
    <span class="token literal-property property">x</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
    <span class="token literal-property property">y</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
    <span class="token literal-property property">z</span><span class="token operator">:</span> number
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span>
    octaves <span class="token operator">=</span> <span class="token number">4</span><span class="token punctuation">,</span>
    falloff <span class="token operator">=</span> <span class="token number">0.5</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">)</span></code></pre>
<p>We can sample a fractal noise function at any x and y by calling <code>noise([x, y])</code>. By default, this calculates fractal noise with 4 octaves and a 50% decrease in amplitude for each, but you can change this as needed. Now that we have the function, let’s turn this into height.</p>
<h2 id="drawing-the-noise">Drawing the noise</h2>
<p>First, we can initialize a new Turtle with <code>const t = new Turtle()</code>.</p>
<p>Then, iterate over all the points within some area, such as 0 &#x3C; y &#x3C; 15 and 0 &#x3C; x &#x3C; 10, moving by a small value <code>dx</code> and <code>dy</code> each time.</p>
<pre class="language-js"><code is:raw="" class="language-js"><span class="token keyword">const</span> dx <span class="token operator">=</span> Some small number
<span class="token keyword">const</span> dy <span class="token operator">=</span> Vertical spacing between lines
<span class="token keyword">const</span> noise_x_scale <span class="token operator">=</span> How horizontally stretched the noise is
<span class="token keyword">const</span> noise_y_scale <span class="token operator">=</span> How vertically stretched the noise is
<span class="token keyword">const</span> noise_amp <span class="token operator">=</span> The height scale <span class="token keyword">of</span> the terrain

<span class="token keyword">function</span> <span class="token function">getHeight</span><span class="token punctuation">(</span><span class="token parameter">x<span class="token punctuation">,</span> y</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token keyword">return</span> <span class="token function">noise</span><span class="token punctuation">(</span>
	<span class="token punctuation">[</span>x <span class="token operator">*</span> noise_x_scale<span class="token punctuation">,</span> y <span class="token operator">*</span> noise_y_scale<span class="token punctuation">]</span>
	<span class="token punctuation">)</span> <span class="token operator">*</span> noise_amp
<span class="token punctuation">}</span>

<span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> y <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> y <span class="token operator">&#x3C;</span> <span class="token number">15</span><span class="token punctuation">;</span> y <span class="token operator">+=</span> dy<span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> x <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> x <span class="token operator">&#x3C;</span> <span class="token number">10</span><span class="token punctuation">;</span> x <span class="token operator">+=</span> dx<span class="token punctuation">)</span> <span class="token punctuation">{</span>
		height <span class="token operator">=</span> <span class="token function">getHeight</span><span class="token punctuation">(</span>x<span class="token punctuation">,</span> y<span class="token punctuation">)</span>
	 <span class="token punctuation">}</span>
<span class="token punctuation">}</span></code></pre>
<p>Using the <code>t.goto([x, y])</code> function in Haxidraw, we can create straight lines. If we want to replicate a smooth curve, we have to use many <code>goto</code> commands with very small changes in the x and y.</p>
<p>If we just call <code>t.goto([x, y])</code> at every x and y in our loop, we’ll get straight lines. Instead, let’s add the noise height to this, with <code>t.goto([x, y + height])</code>.</p>
<p>Using <code>drawTurtles(t)</code> at the end, we can visualize the path.
You may notice that there’s a straight line between the start and end of each path. This is because the pen is still down when we start a new line, and it can be solved by simply raising the pen if we’re going to the first point of a new line.</p>
<p>If all goes well, you should see many rough lines, that look something like this:</p>
<img src="https://cloud-2d1gm9q2d-hack-club-bot.vercel.app/0image.png" width="512">
<p>To give the appearance that we’re looking at this from the side, we can divide the y value by 2 or 3 in each <code>goto</code> command. This will shrink the terrain vertically, but leave the hill height the same.</p>
<p>This is starting to look like mountains! If we want to make these look more like islands instead, we’d need to cut off the noise below a given height, and replace it with flat-looking water. By returning <code>Math.max(height, sea_level)</code> in our <code>getHeight</code> function, only the larger of the two values will be returned. This means we’ll see a line at sea level whenever the noise height is below it.</p>
<p>That water still looks a bit boring, though! Trigonometric functions like <code>Math.sin()</code> and <code>Math.cos()</code> are great for creating wave-like patterns. If we add the sine of the x value to the sea level, the water will be higher and lower in a wave-like pattern. Going further, by offsetting the input to the sine function by another wave, such as the cosine of the y value, the waves will sway side to side depending on how far up in the image they are. If you’re not following along with why this works, try tweaking constants and scaling the waves in various ways to gain an intuition for what each part of the code contributes to the output.</p>
<pre class="language-js"><code is:raw="" class="language-js">sea_level <span class="token operator">=</span>
  default_wave_height <span class="token operator">+</span>
  wave_height <span class="token operator">*</span> Math<span class="token punctuation">.</span><span class="token function">sin</span><span class="token punctuation">(</span><span class="token punctuation">(</span>x <span class="token operator">+</span> Math<span class="token punctuation">.</span><span class="token function">cos</span><span class="token punctuation">(</span>y <span class="token operator">*</span> offset_freq<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">*</span> wave_freq<span class="token punctuation">)</span></code></pre>
<p>Of course, for this code, you’d need to set actual values to all the variables mentioned. By now, you’ll probably have something that looks like this:</p>
<img src="https://cloud-nngt3uf5z-hack-club-bot.vercel.app/0image.png" width="512">
<p>Most of the hard work is done by now! But, you might be noticing a big problem with how this all looks, especially with high enough mountains. We can see through the terrain in some places! Because we’re just 2D drawing lines that <em>look</em> 3D, paths in “front” of others won’t block paths that are “behind”. To solve this, we need something called <strong>occlusion</strong>.</p>
<h2 id="adding-occlusion">Adding occlusion</h2>
<p>Occlusion can be tricky, so it’ll help to break down the problem a bit.</p>
<p>Our problem:</p>
<blockquote>
<p>If an line is in <strong>front</strong> of another, and the other line goes <strong>under</strong> it, it should be <strong>invisible</strong></p>
</blockquote>
<p>Let’s define some of those phrases in the context of our code:</p>
<blockquote>
<p><strong>Front</strong>: Lines that we draw earlier in our loop along the y axis are the ones that should be occluding others
<strong>Under</strong>: If a line has the same x value as another but a lower y value, it’s under it
<strong>Invisible</strong>: We should raise the pen before moving to it</p>
</blockquote>
<p>So, we need to remember where the previous lines in the same x column are, to check if our current line is in front. Actually, we only need to store the maximum y value in our column, because there’s no need to occlude behind a line when there’s another higher one.</p>
<p>We can store these values simply using an array where each index corresponds to some x value we’ll stop at:
<code>let maxHeights = Array(Math.floor(screen_width/dx)).fill(0)</code></p>
<p>Now, for each point, we can check if we’re below the previous maximum y value, with <code>if (height + y/3 > maxHeights[Math.floor(x/dx)])</code>. If so, simply set our current height to be the new maximum at this <code>maxHeights</code> index, and draw. Otherwise, raise the pen.</p>
<p><code>dx</code> has to be lowered a lot after this, because otherwise there’s a lot of obvious artifacts.</p>
<p>Once that’s implemented, the image will look more like this:</p>
<img src="https://cloud-lp7dkev90-hack-club-bot.vercel.app/0image.png" width="512">
<p>If you compare that to the image before occlusion, you’ll see the difference. Now, we’re almost done! The image still looks a bit too much like just noise, and we can go farther to make it look like real islands.</p>
<h2 id="making-it-look-nice">Making it look nice</h2>
<p>An easy fix would be to add some perspective. This can be done by shrinking hills proportionally to their distance. Simply divide the height by y plus some number: <code>(y + perspective_offset)</code> at the end of the <code>getHeight</code> function. We need to add that extra value to y because 1/x is asymptotic at 0, and we want to avoid the infinity. In 3D, you can think of this as moving backward some distance from the first hill. This change will probably have to be counteracted by changing the sea level and default hill height, because we’re shrinking distant hills so much.</p>
<p>We’re really close to a complete image, but there’s a one more thing we can add to really make the image look nicer: trees.</p>
<p>Trees generally grow a good distance above sea level, and they’re pretty random in height. Luckily for us, trees can be easily approximated as straight lines from far enough away. Simply create a <code>drawTree(x, y)</code> function, that creates a vertical line like this:</p>
<pre class="language-js"><code is:raw="" class="language-js">size <span class="token operator">=</span> tree_size <span class="token operator">*</span> Math<span class="token punctuation">.</span><span class="token function">random</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> size <span class="token operator">/</span> <span class="token number">2</span>
t<span class="token punctuation">.</span><span class="token function">goto</span><span class="token punctuation">(</span><span class="token punctuation">[</span>x<span class="token punctuation">,</span> y<span class="token punctuation">]</span><span class="token punctuation">)</span>
t<span class="token punctuation">.</span><span class="token function">goto</span><span class="token punctuation">(</span><span class="token punctuation">[</span>x<span class="token punctuation">,</span> y <span class="token operator">+</span> size<span class="token punctuation">]</span><span class="token punctuation">)</span>
t<span class="token punctuation">.</span><span class="token function">up</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
t<span class="token punctuation">.</span><span class="token function">goto</span><span class="token punctuation">(</span><span class="token punctuation">[</span>x<span class="token punctuation">,</span> y<span class="token punctuation">]</span><span class="token punctuation">)</span></code></pre>
<p>Then, we should only call this if <code>Math.random() > tree_prob &#x26;&#x26; height * (y + perspective_offset) > tree_line</code>. We multiply by <code>(y + perspective_offset)</code> to cancel out the division back in the <code>getHeight</code> function, and ignore perspective. With all this done, you’ll have a nice looking landscape, generated 100% from code. Great job!</p>
<img src="https://cloud-gfjjr08b1-hack-club-bot.vercel.app/0image.png" width="512">
<h2 id="more-experimentation">More experimentation</h2>
<ul>
<li>Try tweaking all the parameters, and see if you can create different types of environments.</li>
<li>What happens if we use a different noise function?</li>
<li>The way we implemented perspective only shrinks distant hills vertically. See what happens if you decrease the horizontal noise scale as the hills get farther away, and try using that for more realistic perspective.</li>
<li>Add more decorations! We’ve added trees, but you could also add houses, rocks, or anything.</li>
</ul>
<h2 id="the-code">The code</h2>
<p>I’ve avoided giving away too much code, as it’s more fun to work through some of the potential problems yourself, but if you get stuck somewhere along the guide, you can reference this:</p>
<pre class="language-js"><code is:raw="" class="language-js"><span class="token keyword">const</span> t <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Turtle</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token keyword">const</span> dx <span class="token operator">=</span> <span class="token number">0.005</span>
<span class="token keyword">const</span> dy <span class="token operator">=</span> <span class="token number">0.26</span>
<span class="token keyword">const</span> noise_x_scale <span class="token operator">=</span> <span class="token number">0.4</span>
<span class="token keyword">const</span> noise_y_scale <span class="token operator">=</span> <span class="token number">0.6</span>
<span class="token keyword">const</span> noise_amp <span class="token operator">=</span> <span class="token number">28.2</span>

<span class="token keyword">const</span> wave_height <span class="token operator">=</span> <span class="token number">0.052</span>
<span class="token keyword">const</span> offset_freq <span class="token operator">=</span> <span class="token operator">-</span><span class="token number">1.3</span>
<span class="token keyword">const</span> wave_freq <span class="token operator">=</span> <span class="token number">16.5</span>
<span class="token keyword">const</span> default_wave_height <span class="token operator">=</span> <span class="token number">11</span>
<span class="token keyword">const</span> tree_size <span class="token operator">=</span> <span class="token number">0.04</span>

<span class="token keyword">let</span> maxHeights <span class="token operator">=</span> <span class="token function">Array</span><span class="token punctuation">(</span>Math<span class="token punctuation">.</span><span class="token function">floor</span><span class="token punctuation">(</span><span class="token number">10</span> <span class="token operator">/</span> dx<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">fill</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span>

<span class="token keyword">function</span> <span class="token function">drawTree</span><span class="token punctuation">(</span><span class="token parameter">x<span class="token punctuation">,</span> y</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  size <span class="token operator">=</span> tree_size <span class="token operator">*</span> Math<span class="token punctuation">.</span><span class="token function">random</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> size <span class="token operator">/</span> <span class="token number">2</span>
  t<span class="token punctuation">.</span><span class="token function">goto</span><span class="token punctuation">(</span><span class="token punctuation">[</span>x<span class="token punctuation">,</span> y<span class="token punctuation">]</span><span class="token punctuation">)</span>
  t<span class="token punctuation">.</span><span class="token function">goto</span><span class="token punctuation">(</span><span class="token punctuation">[</span>x<span class="token punctuation">,</span> y <span class="token operator">+</span> size<span class="token punctuation">]</span><span class="token punctuation">)</span>
  t<span class="token punctuation">.</span><span class="token function">up</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  t<span class="token punctuation">.</span><span class="token function">goto</span><span class="token punctuation">(</span><span class="token punctuation">[</span>x<span class="token punctuation">,</span> y<span class="token punctuation">]</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">getHeight</span><span class="token punctuation">(</span><span class="token parameter">x<span class="token punctuation">,</span> y</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> height <span class="token operator">=</span> <span class="token function">noise</span><span class="token punctuation">(</span><span class="token punctuation">[</span>x <span class="token operator">*</span> noise_x_scale<span class="token punctuation">,</span> y <span class="token operator">*</span> noise_y_scale<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">*</span> noise_amp
  sea_level <span class="token operator">=</span>
    default_wave_height <span class="token operator">+</span>
    wave_height <span class="token operator">*</span> Math<span class="token punctuation">.</span><span class="token function">sin</span><span class="token punctuation">(</span><span class="token punctuation">(</span>x <span class="token operator">+</span> Math<span class="token punctuation">.</span><span class="token function">cos</span><span class="token punctuation">(</span>y <span class="token operator">*</span> offset_freq<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">*</span> wave_freq<span class="token punctuation">)</span>
  <span class="token keyword">return</span> Math<span class="token punctuation">.</span><span class="token function">max</span><span class="token punctuation">(</span>sea_level<span class="token punctuation">,</span> height<span class="token punctuation">)</span> <span class="token operator">*</span> <span class="token punctuation">(</span><span class="token number">1</span> <span class="token operator">/</span> <span class="token punctuation">(</span>y <span class="token operator">+</span> <span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> y <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> y <span class="token operator">&#x3C;</span> <span class="token number">15</span><span class="token punctuation">;</span> y <span class="token operator">+=</span> dy<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> x <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> x <span class="token operator">&#x3C;</span> <span class="token operator">+</span><span class="token number">6</span><span class="token punctuation">;</span> x <span class="token operator">+=</span> dx<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    height <span class="token operator">=</span> <span class="token function">getHeight</span><span class="token punctuation">(</span>x<span class="token punctuation">,</span> y<span class="token punctuation">)</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>height <span class="token operator">+</span> y <span class="token operator">/</span> <span class="token number">3</span> <span class="token operator">></span> maxHeights<span class="token punctuation">[</span>Math<span class="token punctuation">.</span><span class="token function">floor</span><span class="token punctuation">(</span>x <span class="token operator">/</span> dx<span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      maxHeights<span class="token punctuation">[</span>Math<span class="token punctuation">.</span><span class="token function">floor</span><span class="token punctuation">(</span>x <span class="token operator">/</span> dx<span class="token punctuation">)</span><span class="token punctuation">]</span> <span class="token operator">=</span> height <span class="token operator">+</span> y <span class="token operator">/</span> <span class="token number">3</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>x <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        t<span class="token punctuation">.</span><span class="token function">up</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        t<span class="token punctuation">.</span><span class="token function">down</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>Math<span class="token punctuation">.</span><span class="token function">random</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">></span> <span class="token number">0.75</span> <span class="token operator">&#x26;&#x26;</span> height <span class="token operator">*</span> <span class="token punctuation">(</span>y <span class="token operator">+</span> <span class="token number">9</span><span class="token punctuation">)</span> <span class="token operator">></span> <span class="token operator">+</span><span class="token number">13.0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">drawTree</span><span class="token punctuation">(</span>x<span class="token punctuation">,</span> y <span class="token operator">/</span> <span class="token number">3</span> <span class="token operator">+</span> height<span class="token punctuation">)</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      t<span class="token punctuation">.</span><span class="token function">up</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    t<span class="token punctuation">.</span><span class="token function">goto</span><span class="token punctuation">(</span><span class="token punctuation">[</span>x<span class="token punctuation">,</span> y <span class="token operator">/</span> <span class="token number">3</span> <span class="token operator">+</span> height<span class="token punctuation">]</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token function">drawTurtles</span><span class="token punctuation">(</span>t<span class="token punctuation">)</span></code></pre>`);
const frontmatter = { "title": "Landscape", "thumbnail": "https://cloud-gfjjr08b1-hack-club-bot.vercel.app/0image.png", "contributors": "henrybass" };
const file = "/Users/jchen/Documents/Programming/haxidraw/new/guides/landscape.md";
const url = void 0;
function rawContent() {
  return '\n### (Intermediate, ~45 min, by Henry Bass)\n\n<img src="https://cloud-gfjjr08b1-hack-club-bot.vercel.app/0image.png" width="512"/>\n\nThis is an explainer on how to create art like the image above in the [Haxidraw editor](https://haxidraw.hackclub.dev/). It assumes some knowledge of programming in JavaScript and how Haxidraw works, but nothing beyond that.\n\n#### Steps:\n\n- Create a height-map\n- Draw it\n- Add occlusion\n- Make it look nice\n\n## Creating a height-map\n\nTo try and create realistic terrain, we should first look at the real thing. Here\'s a map of some hills in Canada:\n\n<img src="https://cloud-g5b83d93q-hack-club-bot.vercel.app/0image.png" width="512"/>\nNotice that, although the terrain is complex, it looks somewhat random. There\'s also seemingly random detail at both large and small scales, from massive hills to small bumps.\n\nTo replicate this in code, a technique is used called Fractal Noise. A reasonable first step would be to start out with pure randomness.\n\nHere\'s an image made up of large pixels of completely random brightness:\n\n<img src="https://cloud-fgexi20ng-hack-club-bot.vercel.app/0test.png" width="512"/>\n\nReal terrain, of course, isn\'t made up of large squares. To get closer to the real thing, we can blur this image to make it smoother.\n\n<img src="https://cloud-i3ygpagk6-hack-club-bot.vercel.app/0test1.png" width="512"/>\n\nThis is much closer, but it\'s missing an essential aspect: Detail. Hills on a large scale resemble our image, but that resemblance breaks when we look closer. Conveniently though, the detail at both large and small scales looks pretty similar. So to capture this, we can try adding together our random noise on different scales. Each time, we decrease the amplitude of the noise and the blur radius ("Sigma"), while increasing the frequency.\n\n<img src="https://cloud-oidzg4hcv-hack-club-bot.vercel.app/0untitled_drawing__5_.png" width="512"/>\n\nThat looks a lot closer! As a note, the amount we change the frequency, amplitude, and blur with respect to each octave is arbitrary, and tweaking those functions can lead to interesting variations of our noise. The name of this technique is: _Fractal Noise_.\n\nIn fact, the Haxidraw editor actually has a function for fractal noise built in!\n\n```js\n// y and z are optional\nnoise(\n  [\n    x: number,\n    y: number,\n    z: number\n  ],\n  {\n    octaves = 4,\n    falloff = 0.5\n  }\n)\n```\n\nWe can sample a fractal noise function at any x and y by calling `noise([x, y])`. By default, this calculates fractal noise with 4 octaves and a 50% decrease in amplitude for each, but you can change this as needed. Now that we have the function, let\'s turn this into height.\n\n## Drawing the noise\n\nFirst, we can initialize a new Turtle with `const t = new Turtle()`.\n\nThen, iterate over all the points within some area, such as 0 < y < 15 and 0 < x < 10, moving by a small value `dx` and `dy` each time.\n\n```js\nconst dx = Some small number\nconst dy = Vertical spacing between lines\nconst noise_x_scale = How horizontally stretched the noise is\nconst noise_y_scale = How vertically stretched the noise is\nconst noise_amp = The height scale of the terrain\n\nfunction getHeight(x, y) {\n	return noise(\n	[x * noise_x_scale, y * noise_y_scale]\n	) * noise_amp\n}\n\nfor (let y = 0; y < 15; y += dy) {\n	for (let x = 0; x < 10; x += dx) {\n		height = getHeight(x, y)\n	 }\n}\n```\n\nUsing the `t.goto([x, y])` function in Haxidraw, we can create straight lines. If we want to replicate a smooth curve, we have to use many `goto` commands with very small changes in the x and y.\n\nIf we just call `t.goto([x, y])` at every x and y in our loop, we\'ll get straight lines. Instead, let\'s add the noise height to this, with `t.goto([x, y + height])`.\n\nUsing `drawTurtles(t)` at the end, we can visualize the path.\nYou may notice that there\'s a straight line between the start and end of each path. This is because the pen is still down when we start a new line, and it can be solved by simply raising the pen if we\'re going to the first point of a new line.\n\nIf all goes well, you should see many rough lines, that look something like this:\n\n<img src="https://cloud-2d1gm9q2d-hack-club-bot.vercel.app/0image.png" width="512"/>\n\nTo give the appearance that we\'re looking at this from the side, we can divide the y value by 2 or 3 in each `goto` command. This will shrink the terrain vertically, but leave the hill height the same.\n\nThis is starting to look like mountains! If we want to make these look more like islands instead, we\'d need to cut off the noise below a given height, and replace it with flat-looking water. By returning `Math.max(height, sea_level)` in our `getHeight` function, only the larger of the two values will be returned. This means we\'ll see a line at sea level whenever the noise height is below it.\n\nThat water still looks a bit boring, though! Trigonometric functions like `Math.sin()` and `Math.cos()` are great for creating wave-like patterns. If we add the sine of the x value to the sea level, the water will be higher and lower in a wave-like pattern. Going further, by offsetting the input to the sine function by another wave, such as the cosine of the y value, the waves will sway side to side depending on how far up in the image they are. If you\'re not following along with why this works, try tweaking constants and scaling the waves in various ways to gain an intuition for what each part of the code contributes to the output.\n\n```js\nsea_level =\n  default_wave_height +\n  wave_height * Math.sin((x + Math.cos(y * offset_freq)) * wave_freq)\n```\n\nOf course, for this code, you\'d need to set actual values to all the variables mentioned. By now, you\'ll probably have something that looks like this:\n\n<img src="https://cloud-nngt3uf5z-hack-club-bot.vercel.app/0image.png" width="512"/>\n\nMost of the hard work is done by now! But, you might be noticing a big problem with how this all looks, especially with high enough mountains. We can see through the terrain in some places! Because we\'re just 2D drawing lines that _look_ 3D, paths in "front" of others won\'t block paths that are "behind". To solve this, we need something called **occlusion**.\n\n## Adding occlusion\n\nOcclusion can be tricky, so it\'ll help to break down the problem a bit.\n\nOur problem:\n\n> If an line is in **front** of another, and the other line goes **under** it, it should be **invisible**\n\nLet\'s define some of those phrases in the context of our code:\n\n> **Front**: Lines that we draw earlier in our loop along the y axis are the ones that should be occluding others\n> **Under**: If a line has the same x value as another but a lower y value, it\'s under it\n> **Invisible**: We should raise the pen before moving to it\n\nSo, we need to remember where the previous lines in the same x column are, to check if our current line is in front. Actually, we only need to store the maximum y value in our column, because there\'s no need to occlude behind a line when there\'s another higher one.\n\nWe can store these values simply using an array where each index corresponds to some x value we\'ll stop at:\n`let maxHeights = Array(Math.floor(screen_width/dx)).fill(0)`\n\nNow, for each point, we can check if we\'re below the previous maximum y value, with `if (height + y/3 > maxHeights[Math.floor(x/dx)])`. If so, simply set our current height to be the new maximum at this `maxHeights` index, and draw. Otherwise, raise the pen.\n\n`dx` has to be lowered a lot after this, because otherwise there\'s a lot of obvious artifacts.\n\nOnce that\'s implemented, the image will look more like this:\n\n<img src="https://cloud-lp7dkev90-hack-club-bot.vercel.app/0image.png" width="512"/>\n\nIf you compare that to the image before occlusion, you\'ll see the difference. Now, we\'re almost done! The image still looks a bit too much like just noise, and we can go farther to make it look like real islands.\n\n## Making it look nice\n\nAn easy fix would be to add some perspective. This can be done by shrinking hills proportionally to their distance. Simply divide the height by y plus some number: `(y + perspective_offset)` at the end of the `getHeight` function. We need to add that extra value to y because 1/x is asymptotic at 0, and we want to avoid the infinity. In 3D, you can think of this as moving backward some distance from the first hill. This change will probably have to be counteracted by changing the sea level and default hill height, because we\'re shrinking distant hills so much.\n\nWe\'re really close to a complete image, but there\'s a one more thing we can add to really make the image look nicer: trees.\n\nTrees generally grow a good distance above sea level, and they\'re pretty random in height. Luckily for us, trees can be easily approximated as straight lines from far enough away. Simply create a `drawTree(x, y)` function, that creates a vertical line like this:\n\n```js\nsize = tree_size * Math.random() + size / 2\nt.goto([x, y])\nt.goto([x, y + size])\nt.up()\nt.goto([x, y])\n```\n\nThen, we should only call this if `Math.random() > tree_prob && height * (y + perspective_offset) > tree_line`. We multiply by `(y + perspective_offset)` to cancel out the division back in the `getHeight` function, and ignore perspective. With all this done, you\'ll have a nice looking landscape, generated 100% from code. Great job!\n\n<img src="https://cloud-gfjjr08b1-hack-club-bot.vercel.app/0image.png" width="512"/>\n\n## More experimentation\n\n- Try tweaking all the parameters, and see if you can create different types of environments.\n- What happens if we use a different noise function?\n- The way we implemented perspective only shrinks distant hills vertically. See what happens if you decrease the horizontal noise scale as the hills get farther away, and try using that for more realistic perspective.\n- Add more decorations! We\'ve added trees, but you could also add houses, rocks, or anything.\n\n## The code\n\nI\'ve avoided giving away too much code, as it\'s more fun to work through some of the potential problems yourself, but if you get stuck somewhere along the guide, you can reference this:\n\n```js\nconst t = new Turtle()\n\nconst dx = 0.005\nconst dy = 0.26\nconst noise_x_scale = 0.4\nconst noise_y_scale = 0.6\nconst noise_amp = 28.2\n\nconst wave_height = 0.052\nconst offset_freq = -1.3\nconst wave_freq = 16.5\nconst default_wave_height = 11\nconst tree_size = 0.04\n\nlet maxHeights = Array(Math.floor(10 / dx)).fill(0)\n\nfunction drawTree(x, y) {\n  size = tree_size * Math.random() + size / 2\n  t.goto([x, y])\n  t.goto([x, y + size])\n  t.up()\n  t.goto([x, y])\n}\n\nfunction getHeight(x, y) {\n  let height = noise([x * noise_x_scale, y * noise_y_scale]) * noise_amp\n  sea_level =\n    default_wave_height +\n    wave_height * Math.sin((x + Math.cos(y * offset_freq)) * wave_freq)\n  return Math.max(sea_level, height) * (1 / (y + 10))\n}\n\nfor (let y = 0; y < 15; y += dy) {\n  for (let x = 0; x < +6; x += dx) {\n    height = getHeight(x, y)\n    if (height + y / 3 > maxHeights[Math.floor(x / dx)]) {\n      maxHeights[Math.floor(x / dx)] = height + y / 3\n      if (x == 0) {\n        t.up()\n      } else {\n        t.down()\n      }\n      if (Math.random() > 0.75 && height * (y + 9) > +13.0) {\n        drawTree(x, y / 3 + height)\n      }\n    } else {\n      t.up()\n    }\n    t.goto([x, y / 3 + height])\n  }\n}\n\ndrawTurtles(t)\n```\n';
}
function compiledContent() {
  return html;
}
function getHeadings() {
  return [{ "depth": 3, "slug": "intermediate-45-min-by-henry-bass", "text": "(Intermediate, ~45 min, by Henry Bass)" }, { "depth": 4, "slug": "steps", "text": "Steps:" }, { "depth": 2, "slug": "creating-a-height-map", "text": "Creating a height-map" }, { "depth": 2, "slug": "drawing-the-noise", "text": "Drawing the noise" }, { "depth": 2, "slug": "adding-occlusion", "text": "Adding occlusion" }, { "depth": 2, "slug": "making-it-look-nice", "text": "Making it look nice" }, { "depth": 2, "slug": "more-experimentation", "text": "More experimentation" }, { "depth": 2, "slug": "the-code", "text": "The code" }];
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

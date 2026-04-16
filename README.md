Inspired by [hexo-spoiler](https://github.com/unnamed42/hexo-spoiler)

## Install

```bash
npm install hexo-sliding-spoiler --save
```

If hexo can't detect this plugin automatically, you need to modify the `plugins` section of `[path_to_your_site]/_config.yml` manually, like:

```yaml
plugins:
 - hexo-sliding-spoiler
```

## Syntax

```plain
{% sliding_spoiler title %}
content
{% endsliding_spoiler %}
```

It will hide your text and place the title at the top with a dropdown/scroll up arrow.

> **⚠️ Breaking change (v2.0.0):** The tag was renamed from `{% spoiler %}` to
> `{% sliding_spoiler %}` to avoid conflicts with
> [hexo-spoiler](https://github.com/unnamed42/hexo-spoiler). Update your posts
> to use the new tag name.

## Demo

![ ](img/example.gif)

## Example

### One word title

```plain
{% sliding_spoiler word %}
content
{% endsliding_spoiler %}
```

### Title containing spaces


```plain
{% sliding_spoiler "Several spaces in the title" %}
content
{% endsliding_spoiler %}
```

## Using code blocks inside spoilers

Markdown code fences (triple backticks) inside spoiler tags can cause parsing
issues due to a [Hexo/Nunjucks limitation](https://github.com/fletchto99/hexo-sliding-spoiler/issues/15).
Use Hexo's built-in `codeblock` tag instead:

```plain
{% sliding_spoiler "Code example" %}
{% codeblock lang:javascript %}
console.log('Hello world');
{% endcodeblock %}
{% endsliding_spoiler %}
```

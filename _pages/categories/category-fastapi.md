---
title: "FastAPI"
layout: archive
permalink: /categories/fastapi/
author_profile: true
sidebar:
  nav: "categories"
---

{% assign posts = site.categories.fastapi %}
{% for post in posts %} {% include archive-single.html type=page.entries_layout %} {% endfor %}
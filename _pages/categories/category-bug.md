---
title: "Reflections"
layout: archive
permalink: /categories/bug/
author_profile: true
sidebar:
  nav: "categories"
---

{% assign posts = site.categories.bug %}
{% for post in posts %} {% include archive-single.html type=page.entries_layout %} {% endfor %}
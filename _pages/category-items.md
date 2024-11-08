---
title: "Items"
layout: archive
permalink: /categories/items
author_profile: true
sidebar:
  nav: "categories"
---

{% assign posts = site.categories.items %}
{% for post in posts %} {% include archive-single.html type=page.entries_layout %} {% endfor %}
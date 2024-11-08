---
title: "Lifestyle"
layout: archive
permalink: /categories/lifestyle/
author_profile: true
sidebar:
  nav: "categories"
---

{% assign posts = site.categories.lifestyle %}
{% for post in posts %} {% include archive-single.html type=page.entries_layout %} {% endfor %}
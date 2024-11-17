---
title: "DevOps"
layout: archive
permalink: /categories/devops/
author_profile: true
sidebar:
  nav: "categories"
---

{% assign posts = site.categories.devops %}
{% for post in posts %} {% include archive-single.html type=page.entries_layout %} {% endfor %}
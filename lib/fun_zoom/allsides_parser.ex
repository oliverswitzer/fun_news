defmodule FunZoom.AllsidesParser do
  alias FunZoom.Article

  def get_articles(response_body) do
    news_articles = response_body
                    |> Floki.parse_document!()
                    |> Floki.find(".news_trio_grid")

    news_articles
    |> Enum.map(fn article ->
      %Article{
        image: parse_thumbnail(article),
        link: parse_news_link(article),
        title: parse_title(article),
        bias: parse_bias(article)
      }
    end)
  end

  def get_top_stories(response_body) do
    news_articles = response_body
                    |> Floki.parse_document!()
                    |> Floki.find(".breaking-news li a")
  end

  defp parse_title(article) do
    article
    |> Floki.find(".news-title a")
    |> Floki.text()
  end

  defp parse_thumbnail(article) do
    article
    |> Floki.find("img")
    |> Floki.attribute("src")
    |> List.last()
  end

  defp parse_news_link(article) do
    article
    |> Floki.find(".news-title a")
    |> Floki.attribute("href")
    |> List.last()
  end

  defp parse_bias(article) do
    article
    |> Floki.find(".bias-container img")
    |> Floki.attribute("title")
    |> List.first()
    |> String.split(": ")
    |> List.last()
  end
end
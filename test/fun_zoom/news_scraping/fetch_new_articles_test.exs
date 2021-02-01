defmodule FunZoom.NewsScraping.FetchNewArticlesTest do
  use FunZoom.DataCase, async: true

  use Oban.Testing, repo: FunZoom.Repo

  alias FunZoom.Test.MockAllNewsApi
  alias FunZoom.NewsScraping.NewsCategory
  alias FunZoom.NewsScraping.FetchNewArticles, as: Subject
  alias FunZoom.NewsScraping.FetchArticle

  import Hammox

  setup :verify_on_exit!

  test "perform" do
    categories = [
      %NewsCategory{
        title: "Some article",
        link: "http://some-news.com"
      },
      %NewsCategory{
        title: "Some category",
        link: "http://some-other-news.com"
      }
    ]

    MockAllNewsApi
    |> expect(:top_categories, fn  -> categories end)

    perform_job(Subject, %{})

    assert_enqueued worker: FetchArticlesForCategory, args: %{category_url: "http://some-news.com"}
    assert_enqueued worker: FetchArticlesForCategory, args: %{category_url: "http://some-other-news.com"}
  end
end
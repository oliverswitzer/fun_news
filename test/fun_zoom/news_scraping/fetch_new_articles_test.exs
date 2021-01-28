defmodule FunZoom.NewsScraping.FetchNewArticlesTest do
  use FunZoom.DataCase, async: true

  use Oban.Testing, repo: FunZoom.Repo

  alias FunZoom.Test.MockAllNewsApi
  alias FunZoom.NewsScraping.Article
  alias FunZoom.NewsScraping.FetchNewArticles, as: Subject
  alias FunZoom.NewsScraping.FetchArticle

  import Hammox

  setup :verify_on_exit!

  test "perform" do
    articles = [
      %Article{
        title: "Some article",
        image: "http://placekitten.com/200/200",
        bias: "Lean Left",
        link: "http://some-news.com"
      },
      %Article{
        title: "Some other article",
        image: "http://placekitten.com/200/200",
        bias: "Lean Right",
        link: "http://some-other-news.com"
      }
    ]

    MockAllNewsApi
    |> expect(:top_stories, fn  -> articles end)

    perform_job(Subject, %{})

    assert_enqueued worker: FetchArticle, args: %{url: "http://some-news.com"}
    assert_enqueued worker: FetchArticle, args: %{url: "http://some-other-news.com"}
  end
end
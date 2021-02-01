defmodule FunZoom.NewsScraping.FetchNewArticlesTest do
  use FunZoom.DataCase, async: true

  use Oban.Testing, repo: FunZoom.Repo

  alias FunZoom.Test.MockAllNewsApi
  alias FunZoom.NewsCategory
  alias FunZoom.NewsScraping.FetchNewArticles, as: Subject
  alias FunZoom.NewsScraping.FetchArticlesForCategory

  import Hammox

  setup :verify_on_exit!

  describe "perform" do
    test "enqueues jobs to fetch articles for each top category" do
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
end
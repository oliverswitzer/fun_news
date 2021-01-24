defmodule FunZoomWeb.NewsController do
  @mock_data (
  Application.app_dir(:fun_zoom, "priv/mock_data/news.json")
    |> File.read!
    |> Poison.decode!
  )
  @news_url "https://www.allsides.com/unbiased-balanced-news"
  use FunZoomWeb, :controller

  def index(conn, _params) do
    articles = FunZoom.NewsGateway.get_articles()

    render(conn, "index.json", articles: articles)
  end
end

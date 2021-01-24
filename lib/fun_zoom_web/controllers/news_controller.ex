defmodule FunZoomWeb.NewsController do
  use FunZoomWeb, :controller

  def index(conn, _params) do
    articles = FunZoom.NewsGateway.get_articles()

    render(conn, "index.json", articles: articles)
  end
end

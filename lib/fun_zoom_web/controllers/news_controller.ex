defmodule FunZoomWeb.NewsController do
  @mock_data (
  Application.app_dir(:fun_zoom, "priv/mock_data/news.json")
    |> File.read!
    |> Poison.decode!
  )
  use FunZoomWeb, :controller

  def index(conn, _params) do
    conn
    |> put_status(:ok)
    |> json(@mock_data)
  end
end

defmodule FunZoom.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      FunZoom.Repo,
      # Start the Telemetry supervisor
      FunZoomWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: FunZoom.PubSub},
      # Start the Endpoint (http/https)
      FunZoomWeb.Endpoint
      # Start a worker by calling: FunZoom.Worker.start_link(arg)
      # {FunZoom.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: FunZoom.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    FunZoomWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
